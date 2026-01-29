import type { ReactNode } from "react";

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { abandonGameUseCase } from "@/application/games/abandonGameUseCase";
import type { GameId, MatchState } from "@/domain/entities/Game";
import { gameRepository } from "@/infrastructure/convex/repository/gameRepository";

import { MatchActions } from "./MatchActions";

const navigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigate,
}));

vi.mock("@/ui/web/components/ui/button", () => ({
  Button: ({
    onClick,
    children,
  }: {
    onClick?: () => void;
    children: ReactNode;
  }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock("@/application/games/abandonGameUseCase", () => ({
  abandonGameUseCase: vi.fn(),
}));

beforeEach(() => {
  navigate.mockClear();
  vi.mocked(abandonGameUseCase).mockClear();
  vi.mocked(abandonGameUseCase).mockResolvedValue(undefined);
});

const gameId = "gameId" as GameId;

describe("MatchActions", () => {
  it("renders action buttons and round info", () => {
    const match: MatchState = {
      format: "bo3",
      targetWins: 2,
      roundIndex: 2,
      score: { P1: 1, P2: 0 },
      matchWinner: null,
      rounds: [],
    };

    render(<MatchActions gameId={gameId} match={match} />);

    expect(screen.getByText("Abandon Match")).toBeInTheDocument();
    expect(screen.getByText("Round 2")).toBeInTheDocument();
    expect(screen.getByText("Best of 3")).toBeInTheDocument();
  });

  it("abandons the match and navigates back to the lobby", async () => {
    render(<MatchActions gameId={gameId} />);

    fireEvent.click(screen.getByRole("button", { name: /abandon match/i }));

    await waitFor(() => {
      expect(abandonGameUseCase).toHaveBeenCalledWith(gameRepository, {
        gameId,
      });
      expect(navigate).toHaveBeenCalledWith({ to: "/play" });
    });
  });

  it("ignores abandon action while already abandoning", async () => {
    let resolveAbandon: (() => void) | undefined;
    const abandonPromise = new Promise<void>((resolve) => {
      resolveAbandon = resolve;
    });
    vi.mocked(abandonGameUseCase).mockReturnValueOnce(abandonPromise);

    render(<MatchActions gameId={gameId} />);

    const abandonButton = screen.getByRole("button", {
      name: /abandon match/i,
    });
    fireEvent.click(abandonButton);
    fireEvent.click(abandonButton);

    await waitFor(() => {
      expect(abandonGameUseCase).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      resolveAbandon?.();
      await abandonPromise;
    });
  });
});
