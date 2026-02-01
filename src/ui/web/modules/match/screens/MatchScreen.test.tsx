import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { findOrCreateGameUseCase } from "@/application/games/findOrCreateGameUseCase";
import { placeMarkUseCase } from "@/application/games/placeMarkUseCase";
import type { GameId } from "@/domain/entities/Game";
import { gameRepository } from "@/infrastructure/convex/repository/gameRepository";

import { MatchScreen } from "./MatchScreen";

type MatchGame = {
  status: "waiting" | "playing" | "paused" | "ended";
  p1UserId: string;
  p2UserId: string | null;
  currentTurn: "P1" | "P2";
  gridSize?: number;
  winLength?: number;
  turnDurationMs: number | null;
  turnDeadlineTime: number | null;
  board: Array<"P1" | "P2" | null>;
  match: {
    format: "single" | "bo3" | "bo5";
    targetWins: number;
    roundIndex: number;
    score: { P1: number; P2: number };
    matchWinner: "P1" | "P2" | null;
    rounds: [];
  };
  winner?: "P1" | "P2" | null;
  endedReason?: "win" | "draw" | "abandoned" | "disconnect";
  abandonedBy?: "P1" | "P2" | null;
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
const navigate = vi.fn();

vi.mock("@/ui/web/hooks/useMediaQuery", () => ({
  useMediaQuery: () => ({ isDesktop }),
}));

vi.mock("@/ui/web/hooks/useUser", () => ({
  useCurrentUser: () => currentUser,
  useUserById: useUserByIdMock,
}));

vi.mock("@/ui/web/hooks/useGame", () => ({
  useGame: () => game,
  useGameHeartbeat: vi.fn(),
}));

vi.mock("@/application/games/placeMarkUseCase", () => ({
  placeMarkUseCase: vi.fn(),
}));

vi.mock("@/application/games/findOrCreateGameUseCase", () => ({
  findOrCreateGameUseCase: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigate,
}));

vi.mock("@/ui/web/modules/match/components/PlayerCard", () => ({
  PlayerCard: () => <div data-testid="player-card" />,
}));

vi.mock("@/ui/web/modules/match/components/MatchBoard", () => ({
  MatchBoard: ({
    onCellClick,
    status,
    currentTurn,
    currentUserId,
    p1UserId,
    isPlacing,
    gridSize,
    isTimeUp,
  }: {
    onCellClick?: (index: number) => void;
    status: "waiting" | "playing" | "paused" | "ended";
    currentTurn: "P1" | "P2";
    currentUserId?: string;
    p1UserId: string;
    isPlacing?: boolean;
    gridSize?: number;
    isTimeUp?: boolean;
  }) => {
    let currentSlot: "P1" | "P2" | undefined;
    if (currentUserId) {
      currentSlot = currentUserId === p1UserId ? "P1" : "P2";
    }
    const isInteractive =
      status === "playing" &&
      Boolean(currentSlot) &&
      currentTurn === currentSlot &&
      !isPlacing;

    return (
      <div
        data-testid="match-board"
        data-status={status}
        data-current-turn={currentTurn}
        data-current-user-id={currentUserId ?? ""}
        data-p1-user-id={p1UserId}
        data-is-placing={String(isPlacing ?? false)}
        data-interactive={String(isInteractive)}
        data-grid-size={String(gridSize)}
        data-is-time-up={String(isTimeUp ?? false)}
      >
        <button
          type="button"
          onClick={() => {
            if (isInteractive) {
              onCellClick?.(4);
            }
          }}
        >
          Place
        </button>
        <button type="button" onClick={() => onCellClick?.(4)}>
          Force
        </button>
      </div>
    );
  },
}));

vi.mock("@/ui/web/modules/match/components/MatchActions", () => ({
  MatchActions: ({
    variant,
    match,
  }: {
    variant?: string;
    match?: { format: "single" | "bo3" | "bo5" };
  }) => (
    <div
      data-testid="match-actions"
      data-variant={variant ?? "default"}
      data-match-format={match?.format ?? "none"}
    />
  ),
}));

vi.mock(
  "@/ui/web/modules/match/components/match-result/MatchResultOverlay",
  () => ({
    MatchResultOverlay: ({
      status,
      endedReason,
      winner,
      abandonedBy,
      p1UserId,
      currentUserId,
      score,
      currentUser,
      opponentUser,
      onPrimaryAction,
    }: {
      status: string;
      endedReason: string | null;
      winner: string | null;
      abandonedBy: string | null;
      p1UserId: string;
      currentUserId?: string;
      score?: { P1: number; P2: number };
      currentUser: { name: string };
      opponentUser: { name: string };
      onPrimaryAction: () => Promise<void>;
    }) => (
      <div
        data-testid="match-result-overlay"
        data-status={status}
        data-ended-reason={endedReason ?? ""}
        data-winner={winner ?? ""}
        data-abandoned={abandonedBy ?? ""}
        data-p1-user-id={p1UserId}
        data-current-user-id={currentUserId ?? ""}
        data-score={
          score ? `${score.P1.toString()}-${score.P2.toString()}` : ""
        }
        data-current={currentUser.name}
        data-opponent={opponentUser.name}
      >
        <button type="button" onClick={onPrimaryAction}>
          Primary Action
        </button>
      </div>
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
    winLength: 3,
    turnDurationMs: null,
    turnDeadlineTime: null,
    board: ["P1", "P2", null, null, "P1", null, "P2", null, null],
    match: {
      format: "single",
      targetWins: 1,
      roundIndex: 1,
      score: { P1: 0, P2: 0 },
      matchWinner: null,
      rounds: [],
    },
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
    navigate.mockClear();
    vi.mocked(placeMarkUseCase).mockClear();
    vi.mocked(placeMarkUseCase).mockResolvedValue(undefined);
    vi.mocked(findOrCreateGameUseCase).mockClear();
    vi.mocked(findOrCreateGameUseCase).mockResolvedValue("next-game-id");
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

  it("ignores clicks while placing a move", async () => {
    game = {
      ...baseGame,
      status: "playing",
      currentTurn: "P1",
    };
    const pending = new Promise<void>(() => undefined);
    vi.mocked(placeMarkUseCase).mockReturnValueOnce(pending);

    render(<MatchScreen gameId={gameId} />);

    fireEvent.click(screen.getByRole("button", { name: "Place" }));

    await waitFor(() => {
      expect(screen.getByTestId("match-board")).toHaveAttribute(
        "data-is-placing",
        "true",
      );
    });

    fireEvent.click(screen.getByRole("button", { name: "Force" }));

    await waitFor(() => {
      expect(placeMarkUseCase).toHaveBeenCalledTimes(1);
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
      "data-p1-user-id",
      "user-1",
    );
    expect(screen.getByTestId("match-board")).toHaveAttribute(
      "data-current-user-id",
      "user-2",
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
      "data-ended-reason",
      "win",
    );
    expect(screen.getByTestId("match-result-overlay")).toHaveAttribute(
      "data-current",
      "You",
    );
    expect(screen.getByTestId("match-result-overlay")).toHaveAttribute(
      "data-opponent",
      "Opponent",
    );
    expect(screen.getByTestId("match-result-overlay")).toHaveAttribute(
      "data-score",
      "0-0",
    );
  });

  it("creates a new match when the primary overlay action is triggered", async () => {
    game = {
      ...baseGame,
      status: "ended",
      endedReason: "win",
      winner: "P1",
    };
    render(<MatchScreen gameId={gameId} />);

    fireEvent.click(screen.getByRole("button", { name: "Primary Action" }));

    await waitFor(() => {
      expect(findOrCreateGameUseCase).toHaveBeenCalledWith(gameRepository, {
        gridSize: 3,
        winLength: 3,
        matchFormat: "single",
        isTimed: false,
      });
    });
    expect(navigate).toHaveBeenCalledWith({
      to: "/match",
      search: { gameId: "next-game-id" },
    });
  });

  it("does not create a new match when board dimensions are missing", async () => {
    game = {
      ...baseGame,
      status: "ended",
      endedReason: "win",
      winner: "P1",
      winLength: undefined,
    };
    render(<MatchScreen gameId={gameId} />);

    fireEvent.click(screen.getByRole("button", { name: "Primary Action" }));

    await waitFor(() => {
      expect(findOrCreateGameUseCase).not.toHaveBeenCalled();
    });
    expect(navigate).not.toHaveBeenCalled();
  });

  it("logs an error when creating a new match fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(findOrCreateGameUseCase).mockRejectedValueOnce(new Error("boom"));
    game = {
      ...baseGame,
      status: "ended",
      endedReason: "win",
      winner: "P1",
    };
    render(<MatchScreen gameId={gameId} />);

    fireEvent.click(screen.getByRole("button", { name: "Primary Action" }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });
    expect(navigate).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
