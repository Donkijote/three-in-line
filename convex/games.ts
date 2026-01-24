import { v } from "convex/values";

import { getAuthUserId } from "@convex-dev/auth/server";

import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import type { GameStatus } from "./schemas/game";

export const DISCONNECT_THRESHOLD_MS = 60000;
export const HEARTBEAT_FRESH_MS = 30000;
export const PAUSE_TIMEOUT_MS = 5 * 60_000;

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

const getWinner = (board: Array<"P1" | "P2" | null>) => {
  for (const line of winningLines) {
    const [a, b, c] = line;
    const slot = board[a];
    if (slot && slot === board[b] && slot === board[c]) {
      return { winner: slot, line: [...line] };
    }
  }
  return null;
};

type Ctx = MutationCtx | QueryCtx;
type GameDoc = Doc<"games">;

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
    return {
      status: "ended" as const,
      endedReason: "disconnect" as const,
      endedTime: now,
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
  message: string,
) => {
  const timeoutPatch = getTimeoutPatch(game, now);
  if (timeoutPatch) {
    await ctx.db.patch(game._id, timeoutPatch);
    throw new Error(message);
  }
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
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);

    return await ctx.db.insert("games", {
      status: "waiting",
      board: Array.from({ length: 9 }, () => null),
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

export const joinGame = mutation({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const game = await requireGame(ctx, args.gameId);
    const now = Date.now();
    await enforceTimeoutOrThrow(ctx, game, now, "Game timed out");

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
    await enforceTimeoutOrThrow(ctx, game, now, "Game timed out");

    if (game.status === "paused") {
      throw new Error("Game paused; waiting for reconnection");
    }

    if (game.status !== "playing") {
      throw new Error("Game is not in progress");
    }

    if (!Number.isInteger(args.index) || args.index < 0 || args.index > 8) {
      throw new Error("Move index must be an integer between 0 and 8");
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
      await ctx.db.patch(game._id, {
        status: "paused",
        endedReason: "disconnect",
        pausedTime: now,
        updatedTime: now,
        version: game.version + 1,
      });
      throw new Error("Opponent disconnected; game paused");
    }

    const nextBoard = [...game.board];
    nextBoard[args.index] = callerSlot;
    const nextMovesCount = game.movesCount + 1;
    const winnerResult = getWinner(nextBoard);

    let status: GameStatus = game.status;
    let winner: "P1" | "P2" | null = null;
    let winningLine: number[] | null = null;
    let currentTurn = game.currentTurn;
    let endedReason: "win" | "draw" | "abandoned" | "disconnect" | null =
      game.endedReason;
    let endedTime: number | null = game.endedTime;

    if (winnerResult) {
      status = "ended";
      winner = winnerResult.winner;
      winningLine = winnerResult.line;
      endedReason = "win";
      endedTime = Date.now();
    } else if (nextMovesCount >= 9) {
      status = "ended";
      winner = null;
      winningLine = null;
      endedReason = "draw";
      endedTime = Date.now();
    } else {
      currentTurn = callerSlot === "P1" ? "P2" : "P1";
    }

    await ctx.db.patch(game._id, {
      board: nextBoard,
      movesCount: nextMovesCount,
      status,
      winner,
      winningLine,
      currentTurn,
      endedReason,
      endedTime,
      pausedTime: null,
      abandonedBy: null,
      presence: {
        ...game.presence,
        [callerSlot]: { lastSeenTime: Date.now() },
      },
      lastMove: { index: args.index, by: callerSlot, at: Date.now() },
      version: game.version + 1,
      updatedTime: Date.now(),
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

    const status = game.p2UserId ? "playing" : "waiting";

    await ctx.db.patch(game._id, {
      board: Array.from({ length: 9 }, () => null),
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
    await enforceTimeoutOrThrow(ctx, game, now, "Game timed out");
    const nextPresence = {
      ...game.presence,
      [callerSlot]: { lastSeenTime: now },
    };

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
