import { v } from "convex/values";

import {
  DEFAULT_GRID_SIZE,
  DEFAULT_WIN_LENGTH,
  evaluateWinner,
  resolveConfig,
} from "../src/domain/entities/Game";
import { mutation, query } from "./_generated/server";
import {
  buildJoinPresence,
  buildNewGameDoc,
  buildNextBoard,
  buildRoundSummary,
  buildTurnTimerPatch,
  enforceTimeoutOrThrow,
  HEARTBEAT_FRESH_MS,
  patchDisconnectedMove,
  patchOngoingMove,
  patchRoundEnd,
  RECENT_GAMES_FETCH_LIMIT,
  RECENT_GAMES_LIMIT,
  requireBoardShape,
  requireEmptyCell,
  requireGame,
  requireGameInProgress,
  requireMoveIndex,
  requireParticipantSlot,
  requirePlayersTurn,
  requireUserId,
  resolveMatchFormat,
} from "./model/games";
import { type GameStatus, matchFormat } from "./schemas/game";

export const getGame = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    return await requireGame(ctx, args.gameId);
  },
});

export const getRecentGames = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);

    const [asP1, asP2] = await Promise.all([
      ctx.db
        .query("games")
        .withIndex("by_status_p1_updatedTime", (q) =>
          q.eq("status", "ended").eq("p1UserId", userId),
        )
        .order("desc")
        .take(RECENT_GAMES_FETCH_LIMIT),
      ctx.db
        .query("games")
        .withIndex("by_status_p2_updatedTime", (q) =>
          q.eq("status", "ended").eq("p2UserId", userId),
        )
        .order("desc")
        .take(RECENT_GAMES_FETCH_LIMIT),
    ]);

    const sortedGames = [...asP1, ...asP2].sort(
      (a, b) => b.updatedTime - a.updatedTime,
    );
    const dedupedGames: typeof sortedGames = [];
    const seenIds = new Set<(typeof sortedGames)[number]["_id"]>();

    for (const game of sortedGames) {
      if (seenIds.has(game._id)) {
        continue;
      }
      dedupedGames.push(game);
      seenIds.add(game._id);
      if (dedupedGames.length >= RECENT_GAMES_FETCH_LIMIT) {
        break;
      }
    }

    return {
      games: dedupedGames.slice(0, RECENT_GAMES_LIMIT),
    };
  },
});

export const findOrCreateGame = mutation({
  args: {
    gridSize: v.number(),
    winLength: v.number(),
    matchFormat: v.optional(matchFormat),
    isTimed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const { gridSize, winLength } = resolveConfig(args);
    const { format } = resolveMatchFormat(args.matchFormat);
    const isTimed = args.isTimed ?? false;
    const now = Date.now();

    const waitingGames = await ctx.db
      .query("games")
      .withIndex("by_status_p2_createdTime", (q) =>
        q.eq("status", "waiting").eq("p2UserId", null),
      )
      .order("asc")
      .collect();

    const matchingGame = waitingGames.find((game) => {
      if (game.p1UserId === userId) {
        return false;
      }
      const gameGridSize = game.gridSize ?? DEFAULT_GRID_SIZE;
      const gameWinLength = game.winLength ?? DEFAULT_WIN_LENGTH;
      if (game.match.format !== format) {
        return false;
      }
      if (
        isTimed ? game.turnDurationMs === null : game.turnDurationMs !== null
      ) {
        return false;
      }
      return gameGridSize === gridSize && gameWinLength === winLength;
    });

    if (matchingGame) {
      const nextPresence = buildJoinPresence(matchingGame.presence, now);
      const turnTimerPatch = buildTurnTimerPatch(matchingGame, now);

      await ctx.db.patch(matchingGame._id, {
        p2UserId: userId,
        status: "playing",
        pausedTime: null,
        ...turnTimerPatch,
        presence: nextPresence,
        updatedTime: now,
        version: matchingGame.version + 1,
      });

      return { gameId: matchingGame._id };
    }

    const gameId = await ctx.db.insert(
      "games",
      buildNewGameDoc(
        userId,
        gridSize,
        winLength,
        args.matchFormat,
        isTimed,
        now,
      ),
    );

    return { gameId };
  },
});

export const placeMark = mutation({
  args: { gameId: v.id("games"), index: v.number() },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const game = await requireGame(ctx, args.gameId);
    const now = Date.now();
    const didTimeout = await enforceTimeoutOrThrow(ctx, game, now);
    if (didTimeout) {
      return await ctx.db.get(game._id);
    }
    const { gridSize, winLength, expectedLength } = requireBoardShape(game);

    requireGameInProgress(game);
    requireMoveIndex(args.index, expectedLength);
    requireEmptyCell(game.board, args.index);
    const callerSlot = requireParticipantSlot(game, userId);

    requirePlayersTurn(game.currentTurn, callerSlot);

    const timerEnabled = game.turnDurationMs !== null;
    if (timerEnabled) {
      if (game.turnDeadlineTime === null) {
        throw new Error("Timer not initialized");
      }
      if (now > game.turnDeadlineTime) {
        throw new Error("Turn timed out");
      }
    }
    const turnTimerPatch = buildTurnTimerPatch(game, now);

    const opponentSlot = callerSlot === "P1" ? "P2" : "P1";
    const opponentLastSeen = game.presence[opponentSlot].lastSeenTime;
    const isOpponentPresent =
      opponentLastSeen && now - opponentLastSeen <= HEARTBEAT_FRESH_MS;
    const nextBoard = buildNextBoard(game.board, args.index, callerSlot);
    const nextMovesCount = game.movesCount + 1;
    if (!isOpponentPresent) {
      return await patchDisconnectedMove({
        ctx,
        game,
        callerSlot,
        opponentSlot,
        now,
        index: args.index,
        nextBoard,
        nextMovesCount,
        turnTimerPatch,
      });
    }

    const winnerResult = evaluateWinner(nextBoard, { gridSize, winLength });

    const roundEnded =
      Boolean(winnerResult) || nextMovesCount >= expectedLength;

    if (!roundEnded) {
      return await patchOngoingMove({
        ctx,
        game,
        callerSlot,
        now,
        index: args.index,
        nextBoard,
        nextMovesCount,
        turnTimerPatch,
      });
    }

    return await patchRoundEnd({
      ctx,
      game,
      callerSlot,
      now,
      index: args.index,
      expectedLength,
      nextBoard,
      nextMovesCount,
      winnerResult,
      turnTimerPatch,
    });
  },
});

export const abandonGame = mutation({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const game = await requireGame(ctx, args.gameId);
    const callerSlot = requireParticipantSlot(game, userId);

    const isDeletable = game.movesCount === 0 && game.match.rounds.length === 0;

    if (isDeletable) {
      await ctx.db.delete(game._id);
      return { deleted: true };
    }

    const otherPlayer = callerSlot === "P1" ? "P2" : "P1";
    const now = Date.now();
    const roundSummary = buildRoundSummary(
      game,
      "abandoned",
      otherPlayer,
      game.movesCount,
      now,
    );
    const nextRounds = [...game.match.rounds, roundSummary];

    await ctx.db.patch(game._id, {
      status: "ended",
      endedReason: "abandoned",
      endedTime: now,
      pausedTime: null,
      abandonedBy: callerSlot,
      winner: otherPlayer,
      winningLine: null,
      updatedTime: now,
      version: game.version + 1,
      match: {
        ...game.match,
        matchWinner: otherPlayer,
        rounds: nextRounds,
      },
    });

    return { deleted: false };
  },
});

export const heartbeat = mutation({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const game = await requireGame(ctx, args.gameId);
    const callerSlot = requireParticipantSlot(game, userId);

    const now = Date.now();
    const didTimeout = await enforceTimeoutOrThrow(ctx, game, now);
    if (didTimeout) {
      return { ok: true, status: "ended" };
    }
    const nextPresence = {
      ...game.presence,
      [callerSlot]: { lastSeenTime: now },
    };
    const opponentSlot = callerSlot === "P1" ? "P2" : "P1";
    const opponentLastSeen = nextPresence[opponentSlot].lastSeenTime;
    const isOpponentFresh =
      opponentLastSeen !== null && now - opponentLastSeen <= HEARTBEAT_FRESH_MS;

    if (game.status === "playing" && !isOpponentFresh) {
      await ctx.db.patch(game._id, {
        presence: nextPresence,
        status: "paused",
        pausedTime: now,
        updatedTime: now,
        version: game.version + 1,
      });
      return { ok: true, status: "paused" };
    }

    const patch: {
      presence: typeof nextPresence;
      status?: GameStatus;
      endedReason?: "win" | "draw" | "abandoned" | "disconnect" | null;
      pausedTime?: number | null;
      turnDurationMs?: number | null;
      turnDeadlineTime?: number | null;
      updatedTime?: number;
      version?: number;
    } = {
      presence: nextPresence,
      updatedTime: now,
    };

    let nextStatus = game.status;
    if (game.status === "paused") {
      const p1Seen = nextPresence.P1.lastSeenTime;
      const p2Seen = nextPresence.P2.lastSeenTime;
      const isP1Present = p1Seen && now - p1Seen <= HEARTBEAT_FRESH_MS;
      const isP2Present = p2Seen && now - p2Seen <= HEARTBEAT_FRESH_MS;
      if (isP1Present && isP2Present) {
        const turnTimerPatch = buildTurnTimerPatch(game, now);
        patch.status = "playing";
        patch.endedReason = null;
        patch.pausedTime = null;
        patch.turnDurationMs = turnTimerPatch.turnDurationMs;
        patch.turnDeadlineTime = turnTimerPatch.turnDeadlineTime;
        patch.updatedTime = now;
        patch.version = game.version + 1;
        nextStatus = "playing";
      }
    }

    await ctx.db.patch(game._id, patch);
    return { ok: true, status: nextStatus };
  },
});

export const timeoutTurn = mutation({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const game = await requireGame(ctx, args.gameId);
    requireGameInProgress(game);

    if (game.winner !== null) {
      throw new Error("Game has ended");
    }

    if (game.turnDurationMs === null) {
      throw new Error("Timer not enabled");
    }
    if (game.turnDeadlineTime === null) {
      throw new Error("Timer not initialized");
    }

    const now = Date.now();
    if (now < game.turnDeadlineTime) {
      throw new Error("Turn has not timed out");
    }

    const nextTurn = game.currentTurn === "P1" ? "P2" : "P1";

    await ctx.db.patch(game._id, {
      currentTurn: nextTurn,
      turnDeadlineTime: now + game.turnDurationMs,
      updatedTime: now,
      version: game.version + 1,
    });

    return { ok: true };
  },
});
