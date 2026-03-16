import { renderHook } from "@testing-library/react";

import { createGame } from "@/test/factories/game";

import { useHomeMatches } from "./useHomeMatches";

const useCurrentUserMock = vi.fn();

vi.mock("@/ui/shared/user/hooks/useUser", () => ({
  useCurrentUser: () => useCurrentUserMock(),
}));

describe("useHomeMatches", () => {
  it("splits recent and previous matches while mapping status and mode labels", () => {
    const now = Date.now();
    useCurrentUserMock.mockReturnValue({ id: "u1" });

    const { result } = renderHook(() =>
      useHomeMatches([
        createGame({
          id: "recent-win-timed",
          p1UserId: "u1",
          p2UserId: "u2",
          winner: "P1",
          endedReason: "win",
          turnDurationMs: 3000,
          updatedTime: now - 1_000,
        }),
        createGame({
          id: "recent-defeat-bo3",
          p1UserId: "u3",
          p2UserId: "u1",
          winner: "P1",
          endedReason: "win",
          match: {
            format: "bo3",
            targetWins: 2,
            roundIndex: 1,
            score: { P1: 0, P2: 0 },
            matchWinner: null,
            rounds: [],
          },
          updatedTime: now - 2_000,
        }),
        createGame({
          id: "previous-stalemate-grid",
          p1UserId: "u1",
          p2UserId: "u4",
          winner: null,
          endedReason: "draw",
          gridSize: 4,
          updatedTime: now - 8 * 24 * 60 * 60 * 1000,
        }),
      ]),
    );

    expect(result.current.recentMatches).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "recent-win-timed",
          status: "victory",
          subtitle: "Timed Challenge",
          opponentUserId: "u2",
        }),
        expect.objectContaining({
          id: "recent-defeat-bo3",
          status: "defeat",
          subtitle: "Best of Three",
          opponentUserId: "u3",
        }),
      ]),
    );
    expect(result.current.previousWeekMatches).toEqual([
      expect.objectContaining({
        id: "previous-stalemate-grid",
        status: "stalemate",
        subtitle: "Tactical Grid Mode",
        opponentUserId: "u4",
      }),
    ]);
  });

  it("handles a missing current user with the existing fallback behavior", () => {
    const now = Date.now();
    useCurrentUserMock.mockReturnValue(null);

    const { result } = renderHook(() =>
      useHomeMatches([
        createGame({
          id: "no-user-game",
          p1UserId: "u9",
          p2UserId: null,
          winner: "P1",
          endedReason: "win",
          updatedTime: now - 1_000,
        }),
      ]),
    );

    expect(result.current.recentMatches).toEqual([
      expect.objectContaining({
        id: "no-user-game",
        status: "stalemate",
        subtitle: "Classic Mode",
        opponentUserId: "u9",
      }),
    ]);
  });

  it("maps best-of-five mode labels", () => {
    const now = Date.now();
    useCurrentUserMock.mockReturnValue({ id: "u1" });

    const { result } = renderHook(() =>
      useHomeMatches([
        createGame({
          id: "bo5-match",
          p1UserId: "u1",
          p2UserId: "u7",
          winner: "P1",
          endedReason: "win",
          match: {
            format: "bo5",
            targetWins: 3,
            roundIndex: 1,
            score: { P1: 0, P2: 0 },
            matchWinner: null,
            rounds: [],
          },
          updatedTime: now - 500,
        }),
      ]),
    );

    expect(result.current.recentMatches).toEqual([
      expect.objectContaining({
        id: "bo5-match",
        status: "victory",
        subtitle: "Best of Five",
        opponentUserId: "u7",
      }),
    ]);
  });
});
