import { render, screen } from "@testing-library/react";

import type { Game } from "@/domain/entities/Game";

import { HomeMatches } from "./HomeMatches";

const useCurrentUserMock = vi.fn();

vi.mock("@/ui/shared/user/hooks/useUser", () => ({
  useCurrentUser: () => useCurrentUserMock(),
}));

vi.mock("@/ui/web/modules/home/components/HomeMatchCard", () => ({
  HomeMatchCard: ({
    id,
    status,
    subtitle,
    opponentUserId,
  }: {
    id: string;
    status: string;
    subtitle: string;
    opponentUserId: string | null;
  }) => <div>{`${id}|${status}|${subtitle}|${opponentUserId ?? "null"}`}</div>,
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

describe("HomeMatches", () => {
  it("splits recent/previous and maps status + mode labels", () => {
    const now = Date.now();
    useCurrentUserMock.mockReturnValue({ id: "u1" });

    render(
      <HomeMatches
        endedGames={[
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
        ]}
      />,
    );

    expect(
      screen.getByText("recent-win-timed|victory|Timed Challenge|u2"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recent-defeat-bo3|defeat|Best of Three|u3"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "previous-stalemate-grid|stalemate|Tactical Grid Mode|u4",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/no recent matches in the last 7 days/i),
    ).not.toBeVisible();
  });

  it("handles missing current user and empty previous opponent slot fallback", () => {
    useCurrentUserMock.mockReturnValue(null);
    const now = Date.now();

    render(
      <HomeMatches
        endedGames={[
          createGame({
            id: "no-user-game",
            p1UserId: "u9",
            p2UserId: null,
            winner: "P1",
            endedReason: "win",
            updatedTime: now - 1000,
          }),
        ]}
      />,
    );

    expect(
      screen.getByText("no-user-game|stalemate|Classic Mode|u9"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/no recent matches in the last 7 days/i),
    ).not.toBeVisible();
  });

  it("maps bo5 mode label correctly", () => {
    const now = Date.now();
    useCurrentUserMock.mockReturnValue({ id: "u1" });

    render(
      <HomeMatches
        endedGames={[
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
        ]}
      />,
    );

    expect(
      screen.getByText("bo5-match|victory|Best of Five|u7"),
    ).toBeInTheDocument();
  });
});
