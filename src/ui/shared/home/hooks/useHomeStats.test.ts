import { renderHook } from "@testing-library/react";

import type { Game } from "@/domain/entities/Game";

import { useHomeStats } from "./useHomeStats";

const useCurrentUserMock = vi.fn();

vi.mock("@/ui/shared/user/hooks/useUser", () => ({
  useCurrentUser: () => useCurrentUserMock(),
}));

const createGame = (overrides: Partial<Game>): Game => {
  const now = Date.now();
  return {
    id: "game-id",
    status: "ended",
    board: [],
    gridSize: 3,
    winLength: 3,
    match: {
      format: "single",
      targetWins: 1,
      roundIndex: 1,
      score: { P1: 0, P2: 0 },
      matchWinner: null,
      rounds: [],
    },
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
    presence: { P1: { lastSeenTime: now }, P2: { lastSeenTime: now } },
    movesCount: 0,
    version: 1,
    lastMove: null,
    updatedTime: now,
    ...overrides,
  };
};

describe("useHomeStats", () => {
  it("returns zeroed stats when current user is not available", () => {
    useCurrentUserMock.mockReturnValue(null);

    const { result } = renderHook(() =>
      useHomeStats([
        createGame({ winner: "P1", endedReason: "win" }),
        createGame({ winner: "P2", endedReason: "win" }),
      ]),
    );

    expect(result.current).toEqual([
      { id: "wins", label: "Wins", value: "0", accent: "primary" },
      {
        id: "win-rate",
        label: "Win Rate",
        value: "0%",
        accent: "opponent",
      },
      { id: "streak", label: "Streak", value: "0", accent: "warning" },
    ]);
  });

  it("computes wins and win rate while stopping streak on the first non-win", () => {
    useCurrentUserMock.mockReturnValue({ id: "u1" });

    const { result } = renderHook(() =>
      useHomeStats([
        createGame({
          id: "g1",
          p1UserId: "u1",
          winner: "P2",
          endedReason: "win",
        }),
        createGame({
          id: "g2",
          p1UserId: "u1",
          winner: "P1",
          endedReason: "win",
        }),
        createGame({
          id: "g3",
          p1UserId: "u1",
          winner: "P1",
          endedReason: "win",
        }),
      ]),
    );

    expect(result.current).toEqual([
      { id: "wins", label: "Wins", value: "2", accent: "primary" },
      {
        id: "win-rate",
        label: "Win Rate",
        value: "67%",
        accent: "opponent",
      },
      { id: "streak", label: "Streak", value: "0", accent: "warning" },
    ]);
  });

  it("increments streak for consecutive leading wins", () => {
    useCurrentUserMock.mockReturnValue({ id: "u1" });

    const { result } = renderHook(() =>
      useHomeStats([
        createGame({
          id: "g1",
          p1UserId: "u1",
          winner: "P1",
          endedReason: "win",
        }),
        createGame({
          id: "g2",
          p1UserId: "u1",
          winner: "P1",
          endedReason: "win",
        }),
        createGame({
          id: "g3",
          p1UserId: "u1",
          winner: "P2",
          endedReason: "win",
        }),
      ]),
    );

    expect(result.current[0]?.value).toBe("2");
    expect(result.current[2]?.value).toBe("2");
  });
});
