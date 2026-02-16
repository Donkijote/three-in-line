import { render, screen } from "@testing-library/react";

import { HomeScreen } from "./HomeScreen";

const useRecentGamesQueryMock = vi.fn();
const useCurrentUserMock = vi.fn();
const useUserByIdMock = vi.fn();

vi.mock("@/infrastructure/convex/GameApi", () => ({
  useRecentGamesQuery: () => useRecentGamesQueryMock(),
}));

vi.mock("@/ui/web/hooks/useUser", () => ({
  useCurrentUser: () => useCurrentUserMock(),
  useUserById: (userId?: string | null) => useUserByIdMock(userId),
}));

describe("HomeScreen", () => {
  beforeEach(() => {
    useCurrentUserMock.mockReturnValue({
      id: "user-1",
      username: "you",
      avatar: { type: "preset", value: "avatar-1" },
    });
    useUserByIdMock.mockImplementation((userId?: string | null) => {
      if (!userId) {
        return null;
      }
      return {
        id: userId,
        username: `player-${userId.slice(-1)}`,
        avatar: { type: "preset", value: "avatar-2" },
      };
    });
  });

  it("renders the match history dashboard layout", () => {
    useRecentGamesQueryMock.mockReturnValue([]);
    render(<HomeScreen />);

    expect(screen.getByText(/mission logs/i)).toBeInTheDocument();
    expect(screen.getByText(/match history/i)).toBeInTheDocument();
    expect(screen.getByText(/^recent matches$/i)).toBeInTheDocument();
    expect(screen.getByText(/^previous week$/i)).toBeInTheDocument();
  });

  it("renders stat cards and match cards from recent games data", () => {
    const now = Date.now();
    useRecentGamesQueryMock.mockReturnValue([
      {
        id: "game-1",
        status: "ended",
        board: [],
        gridSize: 3,
        winLength: 3,
        match: {
          format: "single",
          targetWins: 1,
          roundIndex: 1,
          score: { P1: 1, P2: 0 },
          matchWinner: "P1",
          rounds: [],
        },
        p1UserId: "user-1",
        p2UserId: "user-2",
        currentTurn: "P1",
        turnDurationMs: null,
        turnDeadlineTime: null,
        winner: "P1",
        winningLine: null,
        endedReason: "win",
        endedTime: now,
        pausedTime: null,
        abandonedBy: null,
        presence: { P1: { lastSeenTime: now }, P2: { lastSeenTime: now } },
        movesCount: 5,
        version: 1,
        lastMove: null,
        updatedTime: now,
      },
      {
        id: "game-2",
        status: "ended",
        board: [],
        gridSize: 3,
        winLength: 3,
        match: {
          format: "single",
          targetWins: 1,
          roundIndex: 1,
          score: { P1: 0, P2: 1 },
          matchWinner: "P2",
          rounds: [],
        },
        p1UserId: "user-2",
        p2UserId: "user-1",
        currentTurn: "P2",
        turnDurationMs: null,
        turnDeadlineTime: null,
        winner: "P2",
        winningLine: null,
        endedReason: "win",
        endedTime: now,
        pausedTime: null,
        abandonedBy: null,
        presence: { P1: { lastSeenTime: now }, P2: { lastSeenTime: now } },
        movesCount: 6,
        version: 1,
        lastMove: null,
        updatedTime: now - 2 * 24 * 60 * 60 * 1000,
      },
    ]);

    render(<HomeScreen />);

    expect(screen.getByText("Wins")).toBeInTheDocument();
    expect(screen.getByText("Win Rate")).toBeInTheDocument();
    expect(screen.getByText("Streak")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getAllByText(/vs player/i)).toHaveLength(2);
    expect(
      screen.getByText(/no recent matches in the last 7 days/i),
    ).not.toBeVisible();
  });
});
