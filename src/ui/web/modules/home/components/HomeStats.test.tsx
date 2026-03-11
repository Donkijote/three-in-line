import { render, screen } from "@testing-library/react";

import type { Game } from "@/domain/entities/Game";

import { HomeStats } from "./HomeStats";

const useCurrentUserMock = vi.fn();

vi.mock("@/ui/shared/user/hooks/useUser", () => ({
  useCurrentUser: () => useCurrentUserMock(),
}));

vi.mock("@/ui/web/modules/home/components/HomeStatCard", () => ({
  HomeStatCard: ({ label, value }: { label: string; value: string }) => (
    <div>{`${label}:${value}`}</div>
  ),
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

describe("HomeStats", () => {
  it("returns zeroed stats when current user is not available", () => {
    useCurrentUserMock.mockReturnValue(null);

    render(
      <HomeStats
        endedGames={[
          createGame({ winner: "P1", endedReason: "win" }),
          createGame({ winner: "P2", endedReason: "win" }),
        ]}
      />,
    );

    expect(screen.getByText("Wins:0")).toBeInTheDocument();
    expect(screen.getByText("Win Rate:0%")).toBeInTheDocument();
    expect(screen.getByText("Streak:0")).toBeInTheDocument();
  });

  it("computes wins/win-rate and stops streak on first non-win", () => {
    useCurrentUserMock.mockReturnValue({ id: "u1" });

    render(
      <HomeStats
        endedGames={[
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
        ]}
      />,
    );

    expect(screen.getByText("Wins:2")).toBeInTheDocument();
    expect(screen.getByText("Win Rate:67%")).toBeInTheDocument();
    expect(screen.getByText("Streak:0")).toBeInTheDocument();
  });

  it("increments streak for consecutive leading wins", () => {
    useCurrentUserMock.mockReturnValue({ id: "u1" });

    render(
      <HomeStats
        endedGames={[
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
        ]}
      />,
    );

    expect(screen.getByText("Wins:2")).toBeInTheDocument();
    expect(screen.getByText("Streak:2")).toBeInTheDocument();
  });
});
