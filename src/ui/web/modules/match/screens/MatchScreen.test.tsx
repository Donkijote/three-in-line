import { render, screen } from "@testing-library/react";

import { MatchScreen } from "./MatchScreen";

type MatchGame = {
  status: "waiting" | "active";
  p1UserId: string;
  p2UserId: string | null;
  currentTurn: "P1" | "P2";
  gridSize?: number;
  board: Array<"P1" | "P2" | null>;
};

type MatchUser = {
  id: string;
  username: string;
  avatar: { type: "preset"; value: string };
};

let isDesktop = false;
let game: MatchGame | undefined;
let currentUser: MatchUser | undefined;
let opponentUser: MatchUser | undefined;

vi.mock("@/ui/web/hooks/useMediaQuery", () => ({
  useMediaQuery: () => ({ isDesktop }),
}));

vi.mock("@/ui/web/hooks/useUser", () => ({
  useCurrentUser: () => currentUser,
  useUserById: () => opponentUser,
}));

vi.mock("@/ui/web/hooks/useGame", () => ({
  useGame: () => game,
}));

vi.mock("@/ui/web/modules/match/components/PlayerCard", () => ({
  PlayerCard: () => <div data-testid="player-card" />,
}));

vi.mock("@/ui/web/modules/match/components/MatchBoard", () => ({
  MatchBoard: () => <div data-testid="match-board" />,
}));

vi.mock("@/ui/web/modules/match/components/MatchActions", () => ({
  MatchActions: ({ variant }: { variant?: string }) => (
    <div data-testid="match-actions" data-variant={variant ?? "default"} />
  ),
}));

describe("MatchScreen", () => {
  const baseGame: MatchGame = {
    status: "active",
    p1UserId: "user-1",
    p2UserId: "user-2",
    currentTurn: "P1",
    gridSize: 3,
    board: ["P1", "P2", null, null, "P1", null, "P2", null, null],
  };

  beforeEach(() => {
    isDesktop = false;
    game = { ...baseGame };
    currentUser = {
      id: "user-1",
      username: "You",
      avatar: { type: "preset", value: "avatar-1" },
    };
    opponentUser = {
      id: "user-2",
      username: "Opponent",
      avatar: { type: "preset", value: "avatar-2" },
    };
  });

  it("shows loading state when the game is missing", () => {
    game = undefined;
    render(<MatchScreen gameId="game-1" />);

    expect(screen.getByText("Loading match")).toBeInTheDocument();
  });

  it("shows waiting state when the opponent is missing", () => {
    game = {
      ...baseGame,
      status: "waiting",
      p2UserId: null,
    };
    opponentUser = undefined;
    render(<MatchScreen gameId="game-1" />);

    expect(screen.getByText("Waiting for opponent")).toBeInTheDocument();
  });

  it("renders desktop layout with HUD actions", () => {
    isDesktop = true;
    render(<MatchScreen gameId="game-1" />);

    expect(screen.getAllByTestId("player-card")).toHaveLength(2);
    expect(screen.getByTestId("match-board")).toBeInTheDocument();
    expect(screen.getByTestId("match-actions")).toHaveAttribute(
      "data-variant",
      "hud",
    );
  });

  it("renders mobile layout with default actions", () => {
    isDesktop = false;
    render(<MatchScreen gameId="game-1" />);

    expect(screen.getAllByTestId("player-card")).toHaveLength(2);
    expect(screen.getByTestId("match-board")).toBeInTheDocument();
    expect(screen.getByTestId("match-actions")).toHaveAttribute(
      "data-variant",
      "default",
    );
  });
});
