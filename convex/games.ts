import { v } from "convex/values";

import { getAuthUserId } from "@convex-dev/auth/server";

import {
  DEFAULT_GRID_SIZE,
  DEFAULT_WIN_LENGTH,
  evaluateWinner,
  resolveConfig,
} from "../src/domain/entities/Game";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import type { GameStatus } from "./schemas/game";

export const DISCONNECT_THRESHOLD_MS = 60000;
export const HEARTBEAT_FRESH_MS = 60000;
export const PAUSE_TIMEOUT_MS = 5 * 60_000;

type Ctx = MutationCtx | QueryCtx;
type GameDoc = Doc<"games">;

const requireBoardShape = (game: GameDoc) => {
  const { gridSize, winLength } = resolveConfig(game);
  const expectedLength = gridSize * gridSize;
  if (game.board.length !== expectedLength) {
    throw new Error("Board length does not match grid size");
  }
  return { gridSize, winLength, expectedLength };
};

const requireUserId = async (ctx: Ctx) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
};

const requireGame = async (ctx: Ctx, gameId: Id<"games">): Promise<GameDoc> => {
  const game = await ctx.db.get(gameId);
  if (!game) {
    throw new Error("Game not found");
  }
  return game;
};

const matchFormat = v.union(
  v.literal("single"),
  v.literal("bo3"),
  v.literal("bo5"),
);

type MatchFormat = "single" | "bo3" | "bo5";

const requireParticipantSlot = (game: GameDoc, userId: Id<"users">) => {
  if (game.p1UserId === userId) {
    return "P1" as const;
  }
  if (game.p2UserId === userId) {
    return "P2" as const;
  }
  throw new Error("You are not a participant in this game");
};

const getTimeoutPatch = (game: GameDoc, now: number) => {
  if (
    game.status === "paused" &&
    game.pausedTime &&
    now - game.pausedTime > PAUSE_TIMEOUT_MS
  ) {
    const p1Seen = game.presence.P1.lastSeenTime;
    const p2Seen = game.presence.P2.lastSeenTime;
    const isP1Fresh = p1Seen !== null && now - p1Seen <= HEARTBEAT_FRESH_MS;
    const isP2Fresh = p2Seen !== null && now - p2Seen <= HEARTBEAT_FRESH_MS;
    let abandonedBy: GameDoc["abandonedBy"] = null;
    if (isP1Fresh !== isP2Fresh) {
      abandonedBy = isP1Fresh ? "P2" : "P1";
    }

    return {
      status: "ended" as const,
      endedReason: "disconnect" as const,
      endedTime: now,
      abandonedBy,
      updatedTime: now,
      version: game.version + 1,
    };
  }
  return null;
};

const enforceTimeoutOrThrow = async (
  ctx: MutationCtx,
  game: GameDoc,
  now: number,
) => {
  const timeoutPatch = getTimeoutPatch(game, now);
  if (!timeoutPatch) {
    return false;
  }

  await ctx.db.patch(game._id, timeoutPatch);
  return true;
};

const resolveMatchFormat = (resolvedFormat = "single" as MatchFormat) => {
  let targetWins = 1;
  if (resolvedFormat === "bo3") {
    targetWins = 2;
  } else if (resolvedFormat === "bo5") {
    targetWins = 3;
  }
  return { format: resolvedFormat, targetWins };
};

const createInitialMatch = (format?: MatchFormat): GameDoc["match"] => {
  const resolved = resolveMatchFormat(format);
  return {
    format: resolved.format,
    targetWins: resolved.targetWins,
    roundIndex: 1,
    score: { P1: 0, P2: 0 },
    matchWinner: null,
    rounds: [],
  };
};

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
    return await ctx.db.insert("games", {
      status: "waiting",
      board: new Array(gridSize * gridSize).fill(null),
      gridSize,
      winLength,
      match: createInitialMatch(args.matchFormat),
      p1UserId: userId,
      p2UserId: null,
      currentTurn: "P1",
      winner: null,
      winningLine: null,
      endedReason: null,
      endedTime: null,
      pausedTime: null,
      abandonedBy: null,
      presence: {
        P1: { lastSeenTime: Date.now() },
        P2: { lastSeenTime: null },
      },
      movesCount: 0,
      version: 0,
      lastMove: null,
      updatedTime: Date.now(),
    });
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
      const nextPresence = {
        ...matchingGame.presence,
        P2: { lastSeenTime: now },
        ...(matchingGame.presence.P1.lastSeenTime
          ? {}
          : { P1: { lastSeenTime: now } }),
      };

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

    const gameId = await ctx.db.insert("games", {
      status: "waiting",
      board: new Array(gridSize * gridSize).fill(null),
      gridSize,
      winLength,
      match: createInitialMatch(args.matchFormat),
      p1UserId: userId,
      p2UserId: null,
      currentTurn: "P1",
      winner: null,
      winningLine: null,
      endedReason: null,
      endedTime: null,
      pausedTime: null,
      abandonedBy: null,
      presence: {
        P1: { lastSeenTime: now },
        P2: { lastSeenTime: null },
      },
      movesCount: 0,
      version: 0,
      lastMove: null,
      updatedTime: now,
    });

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
      const nextPresence = {
        ...game.presence,
        P2: { lastSeenTime: now },
        ...(game.presence.P1.lastSeenTime ? {} : { P1: { lastSeenTime: now } }),
      };

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

    if (game.status === "paused") {
      throw new Error("Game paused; waiting for reconnection");
    }

    if (game.status !== "playing") {
      throw new Error("Game is not in progress");
    }

    if (
      !Number.isInteger(args.index) ||
      args.index < 0 ||
      args.index >= expectedLength
    ) {
      throw new Error(
        `Move index must be an integer between 0 and ${expectedLength - 1}`,
      );
    }

    if (game.board[args.index] !== null) {
      throw new Error("Cell is already occupied");
    }

    const callerSlot = requireParticipantSlot(game, userId);

    if (game.currentTurn !== callerSlot) {
      throw new Error("It is not your turn");
    }

    const opponentSlot = callerSlot === "P1" ? "P2" : "P1";
    const opponentLastSeen = game.presence[opponentSlot].lastSeenTime;
    const isOpponentPresent =
      opponentLastSeen && now - opponentLastSeen <= HEARTBEAT_FRESH_MS;
    if (!isOpponentPresent) {
      const nextBoard = [...game.board];
      nextBoard[args.index] = callerSlot;
      const nextMovesCount = game.movesCount + 1;

      await ctx.db.patch(game._id, {
        board: nextBoard,
        movesCount: nextMovesCount,
        status: "paused",
        endedReason: "disconnect",
        pausedTime: now,
        currentTurn: opponentSlot,
        presence: {
          ...game.presence,
          [callerSlot]: { lastSeenTime: now },
        },
        lastMove: { index: args.index, by: callerSlot, at: now },
        updatedTime: now,
        version: game.version + 1,
      });
      return await ctx.db.get(game._id);
    }

    const nextBoard = [...game.board];
    nextBoard[args.index] = callerSlot;
    const nextMovesCount = game.movesCount + 1;
    const winnerResult = evaluateWinner(nextBoard, { gridSize, winLength });

    const roundWinner = winnerResult ? winnerResult.winner : null;
    const roundEnded =
      Boolean(winnerResult) || nextMovesCount >= expectedLength;

    if (!roundEnded) {
      await ctx.db.patch(game._id, {
        board: nextBoard,
        movesCount: nextMovesCount,
        currentTurn: callerSlot === "P1" ? "P2" : "P1",
        lastMove: { index: args.index, by: callerSlot, at: now },
        updatedTime: now,
        presence: {
          ...game.presence,
          [callerSlot]: { lastSeenTime: now },
        },
        version: game.version + 1,
      });
      return await ctx.db.get(game._id);
    }

    const endedReason = winnerResult ? "win" : "draw";
    const endedTime = now;
    const roundSummary: GameDoc["match"]["rounds"][number] = {
      roundIndex: game.match.roundIndex,
      endedReason,
      winner: roundWinner,
      movesCount: nextMovesCount,
      endedTime,
    };
    const nextRounds = [...game.match.rounds, roundSummary];
    const nextScore = { ...game.match.score };
    if (roundWinner) {
      nextScore[roundWinner] += 1;
    }
    const didMatchEnd =
      roundWinner !== null && nextScore[roundWinner] >= game.match.targetWins;

    if (didMatchEnd) {
      await ctx.db.patch(game._id, {
        board: nextBoard,
        movesCount: nextMovesCount,
        status: "ended",
        winner: roundWinner,
        winningLine: winnerResult?.line ?? null,
        endedReason,
        endedTime,
        pausedTime: null,
        abandonedBy: null,
        presence: {
          ...game.presence,
          [callerSlot]: { lastSeenTime: now },
        },
        lastMove: { index: args.index, by: callerSlot, at: now },
        version: game.version + 1,
        updatedTime: now,
        match: {
          ...game.match,
          score: nextScore,
          matchWinner: roundWinner,
          rounds: nextRounds,
        },
      });
      return await ctx.db.get(game._id);
    }

    await ctx.db.patch(game._id, {
      board: Array.from({ length: expectedLength }, () => null),
      movesCount: 0,
      status: "playing",
      winner: null,
      winningLine: null,
      endedReason: null,
      endedTime: null,
      lastMove: null,
      pausedTime: null,
      abandonedBy: null,
      presence: {
        ...game.presence,
        [callerSlot]: { lastSeenTime: now },
      },
      version: game.version + 1,
      updatedTime: now,
      match: {
        ...game.match,
        roundIndex: game.match.roundIndex + 1,
        score: nextScore,
        matchWinner: null,
        rounds: nextRounds,
      },
    });

    return await ctx.db.get(game._id);
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
    requireParticipantSlot(game, userId);

    await ctx.db.delete(game._id);
    return { deleted: true };
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
