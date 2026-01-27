import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { placeMarkUseCase } from "@/application/games/placeMarkUseCase";
import type { GameId } from "@/domain/entities/Game";
import { gameRepository } from "@/infrastructure/convex/repository/gameRepository";

import { MatchScreen } from "./MatchScreen";

type MatchGame = {
  status: "waiting" | "playing" | "ended";
  p1UserId: string;
  p2UserId: string | null;
  currentTurn: "P1" | "P2";
  gridSize?: number;
  board: Array<"P1" | "P2" | null>;
  winner?: "P1" | "P2" | null;
  endedReason?: "win" | "draw" | "abandoned";
};

type MatchUser = {
  id: string;
  username: string;
  avatar: { type: "preset"; value: string };
};

const { useUserByIdMock } = vi.hoisted(() => ({
  useUserByIdMock: vi.fn(),
}));

let isDesktop = false;
let game: MatchGame | undefined;
let currentUser: MatchUser | undefined;
let opponentUser: MatchUser | undefined;
let lastOpponentId: string | undefined;

vi.mock("@/ui/web/hooks/useMediaQuery", () => ({
  useMediaQuery: () => ({ isDesktop }),
}));

vi.mock("@/ui/web/hooks/useUser", () => ({
  useCurrentUser: () => currentUser,
  useUserById: useUserByIdMock,
}));

vi.mock("@/ui/web/hooks/useGame", () => ({
  useGame: () => game,
}));

vi.mock("@/application/games/placeMarkUseCase", () => ({
  placeMarkUseCase: vi.fn(),
}));

vi.mock("@/ui/web/modules/match/components/PlayerCard", () => ({
  PlayerCard: () => <div data-testid="player-card" />,
}));

vi.mock("@/ui/web/modules/match/components/MatchBoard", () => ({
  MatchBoard: ({
    onCellClick,
    isInteractive,
    playerColors,
    gridSize,
  }: {
    onCellClick?: (index: number) => void;
    isInteractive?: boolean;
    playerColors?: { P1: string; P2: string };
    gridSize: number;
  }) => (
    <div
      data-testid="match-board"
      data-interactive={String(isInteractive)}
      data-p1-color={playerColors?.P1 ?? ""}
      data-p2-color={playerColors?.P2 ?? ""}
      data-grid-size={String(gridSize)}
    >
      <button type="button" onClick={() => onCellClick?.(4)}>
        Place
      </button>
    </div>
  ),
}));

vi.mock("@/ui/web/modules/match/components/MatchActions", () => ({
  MatchActions: ({ variant }: { variant?: string }) => (
    <div data-testid="match-actions" data-variant={variant ?? "default"} />
  ),
}));

vi.mock(
  "@/ui/web/modules/match/components/match-result/MatchResultOverlay",
  () => ({
    MatchResultOverlay: ({
      isOpen,
      result,
      isWinner,
      isAbandonedByCurrentUser,
      currentUser,
      opponentUser,
    }: {
      isOpen: boolean;
      result: "win" | "disconnect";
      isWinner: boolean;
      isAbandonedByCurrentUser?: boolean;
      currentUser: { name: string };
      opponentUser: { name: string };
    }) => (
      <div
        data-testid="match-result-overlay"
        data-open={String(isOpen)}
        data-result={result}
        data-winner={String(isWinner)}
        data-abandoned={String(isAbandonedByCurrentUser ?? false)}
        data-current={currentUser.name}
        data-opponent={opponentUser.name}
      />
    ),
  }),
);

const gameId = "gameId" as GameId;

describe("MatchScreen", () => {
  const baseGame: MatchGame = {
    status: "playing",
    p1UserId: "user-1",
    p2UserId: "user-2",
    currentTurn: "P1",
    gridSize: 3,
    board: ["P1", "P2", null, null, "P1", null, "P2", null, null],
    winner: null,
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
    lastOpponentId = undefined;
    useUserByIdMock.mockClear();
    useUserByIdMock.mockImplementation((id?: string) => {
      lastOpponentId = id;
      return opponentUser;
    });
    vi.mocked(placeMarkUseCase).mockClear();
    vi.mocked(placeMarkUseCase).mockResolvedValue(undefined);
  });

  it("shows loading state when the game is missing", () => {
    game = undefined;
    render(<MatchScreen gameId={gameId} />);

    expect(screen.getByText("Loading match")).toBeInTheDocument();
  });

  it("shows waiting state when the opponent is missing", () => {
    game = {
      ...baseGame,
      status: "waiting",
      p2UserId: null,
    };
    opponentUser = undefined;
    render(<MatchScreen gameId={gameId} />);

    expect(screen.getByText("Waiting for opponent")).toBeInTheDocument();
  });

  it("shows waiting state when the opponent user is unavailable", () => {
    game = {
      ...baseGame,
      status: "playing",
    };
    opponentUser = undefined;
    render(<MatchScreen gameId={gameId} />);

    expect(screen.getByText("Waiting for opponent")).toBeInTheDocument();
  });

  it("resolves opponent id from player two when current user is missing", () => {
    currentUser = undefined;
    game = {
      ...baseGame,
      p2UserId: "user-2",
    };
    render(<MatchScreen gameId={gameId} />);

    expect(lastOpponentId).toBe("user-2");
    expect(screen.getByText("Loading match")).toBeInTheDocument();
  });

  it("renders desktop layout with HUD actions", () => {
    isDesktop = true;
    render(<MatchScreen gameId={gameId} />);

    expect(screen.getAllByTestId("player-card")).toHaveLength(2);
    expect(screen.getByTestId("match-board")).toBeInTheDocument();
    expect(screen.getByTestId("match-actions")).toHaveAttribute(
      "data-variant",
      "hud",
    );
  });

  it("renders mobile layout with default actions", () => {
    isDesktop = false;
    render(<MatchScreen gameId={gameId} />);

    expect(screen.getAllByTestId("player-card")).toHaveLength(2);
    expect(screen.getByTestId("match-board")).toBeInTheDocument();
    expect(screen.getByTestId("match-actions")).toHaveAttribute(
      "data-variant",
      "default",
    );
  });

  it("marks the board as interactive on the current user's turn", () => {
    game = {
      ...baseGame,
      status: "playing",
      currentTurn: "P1",
    };
    render(<MatchScreen gameId={gameId} />);

    expect(screen.getByTestId("match-board")).toHaveAttribute(
      "data-interactive",
      "true",
    );
  });

  it("disables board interaction when it is not the current user's turn", () => {
    game = {
      ...baseGame,
      status: "playing",
      currentTurn: "P2",
    };
    render(<MatchScreen gameId={gameId} />);

    expect(screen.getByTestId("match-board")).toHaveAttribute(
      "data-interactive",
      "false",
    );
  });

  it("ignores clicks when it is not the current user's turn", async () => {
    game = {
      ...baseGame,
      status: "playing",
      currentTurn: "P2",
    };
    render(<MatchScreen gameId={gameId} />);

    fireEvent.click(screen.getByRole("button", { name: "Place" }));

    await waitFor(() => {
      expect(placeMarkUseCase).not.toHaveBeenCalled();
    });
  });

  it("uses opponent colors when the current user is player two", () => {
    currentUser = {
      id: "user-2",
      username: "You",
      avatar: { type: "preset", value: "avatar-2" },
    };
    render(<MatchScreen gameId={gameId} />);

    expect(screen.getByTestId("match-board")).toHaveAttribute(
      "data-p1-color",
      "text-opponent",
    );
    expect(screen.getByTestId("match-board")).toHaveAttribute(
      "data-p2-color",
      "text-primary",
    );
  });

  it("dispatches a move when clicking a cell on the current user's turn", async () => {
    game = {
      ...baseGame,
      status: "playing",
      currentTurn: "P1",
    };
    render(<MatchScreen gameId={gameId} />);

    fireEvent.click(screen.getByRole("button", { name: "Place" }));

    await waitFor(() => {
      expect(placeMarkUseCase).toHaveBeenCalledWith(gameRepository, {
        gameId: "gameId",
        index: 4,
      });
    });
  });

  it("shows match result overlay when the current user wins", () => {
    game = {
      ...baseGame,
      status: "ended",
      endedReason: "win",
      winner: "P1",
    };
    render(<MatchScreen gameId={gameId} />);

    expect(screen.getByTestId("match-result-overlay")).toHaveAttribute(
      "data-open",
      "true",
    );
    expect(screen.getByTestId("match-result-overlay")).toHaveAttribute(
      "data-winner",
      "true",
    );
    expect(screen.getByTestId("match-result-overlay")).toHaveAttribute(
      "data-current",
      "You",
    );
    expect(screen.getByTestId("match-result-overlay")).toHaveAttribute(
      "data-opponent",
      "Opponent",
    );
  });
});
