import { router } from "expo-router";
import { AppState } from "react-native";

import { fireEvent, waitFor } from "@testing-library/react-native";

import { abandonGameUseCase } from "@/application/games/abandonGameUseCase";
import { findOrCreateGameUseCase } from "@/application/games/findOrCreateGameUseCase";
import { heartbeatUseCase } from "@/application/games/heartbeatUseCase";
import { placeMarkUseCase } from "@/application/games/placeMarkUseCase";
import { timeoutTurnUseCase } from "@/application/games/timeoutTurnUseCase";
import { gameRepository } from "@/infrastructure/convex/repository/gameRepository";
import { renderMobile } from "@/test/mobile/render";
import { useGame, useTurnTimer } from "@/ui/shared/match/hooks/useGame";
import { useCurrentUser, useUserById } from "@/ui/shared/user/hooks/useUser";

import { MatchScreen } from "./MatchScreen";

const mockSetHeader = jest.fn();
const mockRemoveAppStateListener = jest.fn();

const baseGame = {
  id: "game-123",
  status: "playing" as const,
  board: ["P1", "P2", null, null, "P1", null, "P2", null, null],
  gridSize: 3,
  winLength: 3,
  match: {
    format: "bo3" as const,
    targetWins: 2,
    roundIndex: 2,
    score: { P1: 1, P2: 0 },
    matchWinner: null,
    rounds: [],
  },
  p1UserId: "user-1",
  p2UserId: "user-2",
  currentTurn: "P1" as const,
  turnDurationMs: null,
  turnDeadlineTime: null,
  winner: null,
  winningLine: null,
  endedReason: null,
  endedTime: null,
  pausedTime: null,
  abandonedBy: null,
  presence: {
    P1: { lastSeenTime: null },
    P2: { lastSeenTime: null },
  },
  movesCount: 3,
  version: 1,
  lastMove: null,
  updatedTime: 100,
};

const currentUser = {
  id: "user-1",
  username: "You",
  avatar: { type: "preset" as const, value: "avatar-1" },
};

const opponentUser = {
  id: "user-2",
  username: "Opponent",
  avatar: { type: "preset" as const, value: "avatar-2" },
};

jest.mock("@/ui/mobile/application/providers/MobileHeaderProvider", () => ({
  useMobileHeader: () => ({
    setHeader: mockSetHeader,
  }),
}));

jest.mock("@/ui/shared/match/hooks/useGame", () => ({
  useGame: jest.fn(),
  useTurnTimer: jest.fn(),
}));

jest.mock("@/ui/shared/user/hooks/useUser", () => ({
  useCurrentUser: jest.fn(),
  useUserById: jest.fn(),
}));

jest.mock("@/application/games/heartbeatUseCase", () => ({
  heartbeatUseCase: jest.fn(),
}));

jest.mock("@/application/games/placeMarkUseCase", () => ({
  placeMarkUseCase: jest.fn(),
}));

jest.mock("@/application/games/findOrCreateGameUseCase", () => ({
  findOrCreateGameUseCase: jest.fn(),
}));

jest.mock("@/application/games/abandonGameUseCase", () => ({
  abandonGameUseCase: jest.fn(),
}));

jest.mock("@/application/games/timeoutTurnUseCase", () => ({
  timeoutTurnUseCase: jest.fn(),
}));

describe("MatchScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AppState, "addEventListener").mockReturnValue({
      remove: mockRemoveAppStateListener,
    } as never);
    jest.mocked(useGame).mockReturnValue(baseGame);
    jest.mocked(useTurnTimer).mockReturnValue({
      isExpired: false,
      progress: 0.5,
      remainingMs: 1000,
    });
    jest.mocked(useCurrentUser).mockReturnValue(currentUser);
    jest.mocked(useUserById).mockReturnValue(opponentUser);
    jest.mocked(heartbeatUseCase).mockResolvedValue(undefined);
    jest.mocked(placeMarkUseCase).mockResolvedValue(undefined);
    jest.mocked(findOrCreateGameUseCase).mockResolvedValue("next-game-id");
    jest.mocked(abandonGameUseCase).mockResolvedValue(undefined);
    jest.mocked(timeoutTurnUseCase).mockResolvedValue(undefined);
  });

  it("shows a missing state when the game id is absent", () => {
    const screen = renderMobile(<MatchScreen />);

    expect(screen.getByText("Missing match")).toBeTruthy();
    expect(
      screen.getByText(
        "A game id is required before the mobile match screen can load.",
      ),
    ).toBeTruthy();
  });

  it("sets and clears the mobile header", () => {
    const screen = renderMobile(<MatchScreen gameId={"game-123"} />);

    expect(mockSetHeader).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Tic-Tac-Toe",
        eyebrow: "Live Match",
      }),
    );

    screen.unmount();

    expect(mockSetHeader).toHaveBeenLastCalledWith(null);
    expect(mockRemoveAppStateListener).toHaveBeenCalled();
  });

  it("sends a heartbeat when the screen mounts", async () => {
    renderMobile(<MatchScreen gameId={"game-123"} />);

    await waitFor(() => {
      expect(heartbeatUseCase).toHaveBeenCalledWith(gameRepository, {
        gameId: "game-123",
      });
    });
  });

  it("shows a loading state while the game is not ready", () => {
    jest.mocked(useGame).mockReturnValue(undefined);

    const screen = renderMobile(<MatchScreen gameId={"game-123"} />);

    expect(screen.getByText("Loading match...")).toBeTruthy();
  });

  it("shows the waiting state when the opponent is missing", () => {
    jest.mocked(useGame).mockReturnValue({
      ...baseGame,
      status: "waiting",
      p2UserId: null,
    });
    jest.mocked(useUserById).mockReturnValue(undefined);

    const screen = renderMobile(<MatchScreen gameId={"game-123"} />);

    expect(screen.getByText("Waiting for opponent")).toBeTruthy();
  });

  it("renders the live match details", () => {
    const screen = renderMobile(<MatchScreen gameId={"game-123"} />);

    expect(screen.getByText("You")).toBeTruthy();
    expect(screen.getByText("Opponent")).toBeTruthy();
    expect(screen.getByText("Round 2 · Best of 3")).toBeTruthy();
    expect(screen.getByText("Abandon Match")).toBeTruthy();
  });

  it("places a mark when tapping an available cell on the current turn", async () => {
    const screen = renderMobile(<MatchScreen gameId={"game-123"} />);

    fireEvent.press(screen.getByLabelText("Match cell 3"));

    await waitFor(() => {
      expect(placeMarkUseCase).toHaveBeenCalledWith(gameRepository, {
        gameId: "game-123",
        index: 2,
      });
    });
  });

  it("ignores taken cells and out-of-turn presses", () => {
    const screen = renderMobile(<MatchScreen gameId={"game-123"} />);

    fireEvent.press(screen.getByLabelText("Match cell 1"));

    expect(placeMarkUseCase).not.toHaveBeenCalled();

    jest.mocked(useGame).mockReturnValue({
      ...baseGame,
      currentTurn: "P2",
    });
    const rerendered = renderMobile(<MatchScreen gameId={"game-123"} />);

    fireEvent.press(rerendered.getByLabelText("Match cell 3"));

    expect(placeMarkUseCase).not.toHaveBeenCalled();
  });

  it("starts a follow-up game from the result overlay", async () => {
    jest.mocked(useGame).mockReturnValue({
      ...baseGame,
      status: "ended",
      endedReason: "win",
      winner: "P1",
    });

    const screen = renderMobile(<MatchScreen gameId={"game-123"} />);

    fireEvent.press(screen.getByText("Play Again"));

    await waitFor(() => {
      expect(findOrCreateGameUseCase).toHaveBeenCalledWith(gameRepository, {
        gridSize: 3,
        winLength: 3,
        matchFormat: "bo3",
        isTimed: false,
      });
    });

    expect(router.replace).toHaveBeenCalledWith({
      pathname: "/match",
      params: { gameId: "next-game-id" },
    });
  });

  it("abandons the match and navigates back to play", async () => {
    const screen = renderMobile(<MatchScreen gameId={"game-123"} />);

    fireEvent.press(screen.getByText("Abandon Match"));

    await waitFor(() => {
      expect(abandonGameUseCase).toHaveBeenCalledWith(gameRepository, {
        gameId: "game-123",
      });
    });

    expect(router.replace).toHaveBeenCalledWith("/play");
  });

  it("times out the turn when the shared timer expires", async () => {
    jest
      .mocked(useTurnTimer)
      .mockImplementation(
        ({ onExpire }: { onExpire?: () => Promise<void> }) => {
          void onExpire?.();
          return {
            isExpired: false,
            progress: 0,
            remainingMs: 0,
          };
        },
      );

    renderMobile(<MatchScreen gameId={"game-123"} />);

    await waitFor(() => {
      expect(timeoutTurnUseCase).toHaveBeenCalledWith(gameRepository, {
        gameId: "game-123",
      });
    });
  });
});
