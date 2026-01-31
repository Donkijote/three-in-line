import { getAuthUserId } from "@convex-dev/auth/server";

import {
  type evaluateWinner,
  resolveConfig,
} from "../../src/domain/entities/Game";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import type {
  GameEndedReason,
  GameStatus,
  MatchFormat,
  MatchState,
  Player,
  PresenceState,
  RoundSummary,
} from "../schemas/game";

export const HEARTBEAT_FRESH_MS = 60000;
export const PAUSE_TIMEOUT_MS = 5 * 60_000;
export const DEFAULT_TURN_DURATION_MS = 3000;

type Ctx = MutationCtx | QueryCtx;
type GameDoc = Doc<"games">;

export const requireBoardShape = (game: GameDoc) => {
  const { gridSize, winLength } = resolveConfig(game);
  const expectedLength = gridSize * gridSize;
  if (game.board.length !== expectedLength) {
    throw new Error("Board length does not match grid size");
  }
  return { gridSize, winLength, expectedLength };
};

export const requireUserId = async (ctx: Ctx) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
};

export const requireGame = async (
  ctx: Ctx,
  gameId: Id<"games">,
): Promise<GameDoc> => {
  const game = await ctx.db.get(gameId);
  if (!game) {
    throw new Error("Game not found");
  }
  return game;
};

export const requireParticipantSlot = (game: GameDoc, userId: Id<"users">) => {
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
    let abandonedBy: Player | null = null;
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

export const enforceTimeoutOrThrow = async (
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

export const resolveMatchFormat = (resolvedFormat: MatchFormat = "single") => {
  let targetWins = 1;
  if (resolvedFormat === "bo3") {
    targetWins = 2;
  } else if (resolvedFormat === "bo5") {
    targetWins = 3;
  }
  return { format: resolvedFormat, targetWins };
};

export const createInitialMatch = (format?: MatchFormat): MatchState => {
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

export const buildJoinPresence = (presence: PresenceState, now: number) => ({
  ...presence,
  P2: { lastSeenTime: now },
  ...(presence.P1.lastSeenTime ? {} : { P1: { lastSeenTime: now } }),
});

export const buildRoundSummary = (
  game: GameDoc,
  endedReason: GameEndedReason,
  winner: Player | null,
  movesCount: number,
  endedTime: number,
): RoundSummary => ({
  roundIndex: game.match.roundIndex,
  endedReason,
  winner,
  movesCount,
  endedTime,
});

export const buildNewGameDoc = (
  userId: Id<"users">,
  gridSize: number,
  winLength: number,
  format: MatchFormat | undefined,
  isTimed: boolean,
  now: number,
) => ({
  status: "waiting" as GameStatus,
  board: new Array(gridSize * gridSize).fill(null),
  gridSize,
  winLength,
  match: createInitialMatch(format),
  p1UserId: userId,
  p2UserId: null,
  currentTurn: "P1" as Player,
  turnDurationMs: isTimed ? DEFAULT_TURN_DURATION_MS : null,
  turnDeadlineTime: null,
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

const isTurnTimerEnabled = (game: GameDoc) => game.turnDurationMs !== null;

export const buildTurnTimerPatch = (game: GameDoc, now: number) => {
  if (!isTurnTimerEnabled(game)) {
    return { turnDurationMs: null, turnDeadlineTime: null };
  }
  const turnDurationMs = game.turnDurationMs ?? DEFAULT_TURN_DURATION_MS;
  return { turnDurationMs, turnDeadlineTime: now + turnDurationMs };
};

export const requireGameInProgress = (game: GameDoc) => {
  if (game.status === "paused") {
    throw new Error("Game paused; waiting for reconnection");
  }
  if (game.status !== "playing") {
    throw new Error("Game is not in progress");
  }
};

export const requireMoveIndex = (index: number, expectedLength: number) => {
  if (!Number.isInteger(index) || index < 0 || index >= expectedLength) {
    throw new Error(
      `Move index must be an integer between 0 and ${expectedLength - 1}`,
    );
  }
};

export const requireEmptyCell = (
  board: Array<Player | null>,
  index: number,
) => {
  if (board[index] !== null) {
    throw new Error("Cell is already occupied");
  }
};

export const requirePlayersTurn = (currentTurn: Player, callerSlot: Player) => {
  if (currentTurn !== callerSlot) {
    throw new Error("It is not your turn");
  }
};

export const buildNextBoard = (
  board: Array<Player | null>,
  index: number,
  player: Player,
) => {
  const nextBoard = [...board];
  nextBoard[index] = player;
  return nextBoard;
};

type TurnTimerPatch = {
  turnDurationMs: number | null;
  turnDeadlineTime: number | null;
};

type BaseMovePatchParams = {
  ctx: MutationCtx;
  game: GameDoc;
  callerSlot: Player;
  now: number;
  index: number;
  nextBoard: Array<Player | null>;
  nextMovesCount: number;
  turnTimerPatch: TurnTimerPatch;
};

type DisconnectedMovePatchParams = BaseMovePatchParams & {
  opponentSlot: Player;
};

type RoundEndPatchParams = BaseMovePatchParams & {
  expectedLength: number;
  winnerResult: ReturnType<typeof evaluateWinner>;
};

export const patchDisconnectedMove = async ({
  ctx,
  game,
  callerSlot,
  opponentSlot,
  now,
  index,
  nextBoard,
  nextMovesCount,
  turnTimerPatch,
}: DisconnectedMovePatchParams) => {
  await ctx.db.patch(game._id, {
    board: nextBoard,
    movesCount: nextMovesCount,
    status: "paused",
    endedReason: "disconnect",
    pausedTime: now,
    currentTurn: opponentSlot,
    ...turnTimerPatch,
    presence: {
      ...game.presence,
      [callerSlot]: { lastSeenTime: now },
    },
    lastMove: { index, by: callerSlot, at: now },
    updatedTime: now,
    version: game.version + 1,
  });
  return await ctx.db.get(game._id);
};

export const patchOngoingMove = async ({
  ctx,
  game,
  callerSlot,
  now,
  index,
  nextBoard,
  nextMovesCount,
  turnTimerPatch,
}: BaseMovePatchParams) => {
  await ctx.db.patch(game._id, {
    board: nextBoard,
    movesCount: nextMovesCount,
    currentTurn: callerSlot === "P1" ? "P2" : "P1",
    ...turnTimerPatch,
    lastMove: { index, by: callerSlot, at: now },
    updatedTime: now,
    presence: {
      ...game.presence,
      [callerSlot]: { lastSeenTime: now },
    },
    version: game.version + 1,
  });
  return await ctx.db.get(game._id);
};

export const patchRoundEnd = async ({
  ctx,
  game,
  callerSlot,
  now,
  index,
  expectedLength,
  nextBoard,
  nextMovesCount,
  winnerResult,
  turnTimerPatch,
}: RoundEndPatchParams) => {
  const endedReason: GameEndedReason = winnerResult ? "win" : "draw";
  const endedTime = now;
  const roundWinner = winnerResult ? winnerResult.winner : null;
  const roundSummary = buildRoundSummary(
    game,
    endedReason,
    roundWinner,
    nextMovesCount,
    endedTime,
  );
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
      lastMove: { index, by: callerSlot, at: now },
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
    ...turnTimerPatch,
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
};
