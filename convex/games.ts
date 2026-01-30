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
  enforceTimeoutOrThrow,
  HEARTBEAT_FRESH_MS,
  patchDisconnectedMove,
  patchOngoingMove,
  patchRoundEnd,
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

export const listWaitingGames = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("games")
      .filter((q) => q.eq(q.field("status"), "waiting"))
      .order("desc")
      .collect();
  },
});

export const myActiveGames = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);

    return await ctx.db
      .query("games")
      .filter((q) =>
        q.and(
          q.neq(q.field("status"), "ended"),
          q.neq(q.field("status"), "canceled"),
          q.or(
            q.eq(q.field("p1UserId"), userId),
            q.eq(q.field("p2UserId"), userId),
          ),
        ),
      )
      .collect();
  },
});

export const createGame = mutation({
  args: {
    gridSize: v.optional(v.number()),
    winLength: v.optional(v.number()),
    matchFormat: v.optional(matchFormat),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const { gridSize, winLength } = resolveConfig(args);
    const now = Date.now();
    return await ctx.db.insert(
      "games",
      buildNewGameDoc(userId, gridSize, winLength, args.matchFormat, now),
    );
  },
});

export const findOrCreateGame = mutation({
  args: {
    gridSize: v.number(),
    winLength: v.number(),
    matchFormat: v.optional(matchFormat),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const { gridSize, winLength } = resolveConfig(args);
    const { format } = resolveMatchFormat(args.matchFormat);
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
      return gameGridSize === gridSize && gameWinLength === winLength;
    });

    if (matchingGame) {
      const nextPresence = buildJoinPresence(matchingGame.presence, now);

      await ctx.db.patch(matchingGame._id, {
        p2UserId: userId,
        status: "playing",
        pausedTime: null,
        presence: nextPresence,
        updatedTime: now,
        version: matchingGame.version + 1,
      });

      return { gameId: matchingGame._id };
    }

    const gameId = await ctx.db.insert(
      "games",
      buildNewGameDoc(userId, gridSize, winLength, args.matchFormat, now),
    );

    return { gameId };
  },
});

export const joinGame = mutation({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const game = await requireGame(ctx, args.gameId);
    const now = Date.now();
    const didTimeout = await enforceTimeoutOrThrow(ctx, game, now);
    if (didTimeout) {
      return await ctx.db.get(game._id);
    }

    if (game.p1UserId === userId) {
      if (game.status === "waiting" && game.p2UserId) {
        await ctx.db.patch(game._id, { status: "playing" });
      }
      return await ctx.db.get(game._id);
    }

    if (game.p2UserId === userId) {
      return await ctx.db.get(game._id);
    }

    if (game.status === "waiting" && !game.p2UserId) {
      const nextPresence = buildJoinPresence(game.presence, now);

      await ctx.db.patch(game._id, {
        p2UserId: userId,
        status: "playing",
        pausedTime: null,
        presence: nextPresence,
        updatedTime: now,
        version: game.version + 1,
      });

      return await ctx.db.get(game._id);
    }

    throw new Error("Game is full");
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
      });
    }

    const winnerResult = evaluateWinner(nextBoard, { gridSize, winLength });

    const roundEnded =
      Boolean(winnerResult) || nextMovesCount >= expectedLength;

    if (!roundEnded) {
      return await patchOngoingMove(
        ctx,
        game,
        callerSlot,
        now,
        args.index,
        nextBoard,
        nextMovesCount,
      );
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
    });
  },
});

export const restartGame = mutation({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const game = await requireGame(ctx, args.gameId);
    const callerSlot = requireParticipantSlot(game, userId);
    const { gridSize, winLength, expectedLength } = requireBoardShape(game);

    const status = game.p2UserId ? "playing" : "waiting";

    await ctx.db.patch(game._id, {
      board: Array.from({ length: expectedLength }, () => null),
      winner: null,
      winningLine: null,
      endedReason: null,
      endedTime: null,
      pausedTime: null,
      abandonedBy: null,
      movesCount: 0,
      lastMove: null,
      currentTurn: "P1",
      status,
      presence: {
        ...game.presence,
        [callerSlot]: { lastSeenTime: Date.now() },
      },
      gridSize,
      winLength,
      version: game.version + 1,
      updatedTime: Date.now(),
    });

    return await ctx.db.get(game._id);
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
        patch.status = "playing";
        patch.endedReason = null;
        patch.pausedTime = null;
        patch.updatedTime = now;
        patch.version = game.version + 1;
        nextStatus = "playing";
      }
    }

    await ctx.db.patch(game._id, patch);
    return { ok: true, status: nextStatus };
  },
});
