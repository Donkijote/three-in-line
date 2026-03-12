import type { Game } from "@/domain/entities/Game";

type GameOverrides = Partial<Omit<Game, "match" | "presence">> & {
  match?: Partial<Game["match"]>;
  presence?: Partial<Game["presence"]>;
};

export const createGame = (overrides: GameOverrides = {}): Game => {
  const now = Date.now();
  const defaultMatch: Game["match"] = {
    format: "single",
    targetWins: 1,
    roundIndex: 1,
    score: { P1: 0, P2: 0 },
    matchWinner: null,
    rounds: [],
  };
  const defaultPresence: Game["presence"] = {
    P1: { lastSeenTime: now },
    P2: { lastSeenTime: now },
  };
  const { match, presence, ...gameOverrides } = overrides;

  return {
    id: "game-id",
    status: "ended",
    board: [],
    gridSize: 3,
    winLength: 3,
    p1UserId: "u1",
    p2UserId: "u2",
    currentTurn: "P1",
    turnDurationMs: null,
    turnDeadlineTime: null,
    winner: null,
    winningLine: null,
    endedReason: "draw",
    endedTime: now,
    pausedTime: null,
    abandonedBy: null,
    movesCount: 0,
    version: 1,
    lastMove: null,
    updatedTime: now,
    ...gameOverrides,
    match: {
      ...defaultMatch,
      ...match,
      score: {
        ...defaultMatch.score,
        ...match?.score,
      },
      rounds: match?.rounds ?? defaultMatch.rounds,
    },
    presence: {
      ...defaultPresence,
      ...presence,
    },
  };
};
