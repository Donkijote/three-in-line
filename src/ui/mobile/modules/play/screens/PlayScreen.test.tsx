import { router } from "expo-router";

import { fireEvent, waitFor } from "@testing-library/react-native";

import { renderMobile } from "@/test/mobile/render";
import { useCreateGame } from "@/ui/shared/play/hooks/useCreateGame";

import { PlayScreen } from "./PlayScreen";

const mockSetHeader = jest.fn();
const mockCreateGame = jest.fn();

jest.mock("@/ui/mobile/application/providers/MobileHeaderProvider", () => ({
  useMobileHeader: () => ({
    setHeader: mockSetHeader,
  }),
}));

jest.mock("@/ui/shared/play/hooks/useCreateGame", () => ({
  useCreateGame: jest.fn(),
}));

describe("PlayScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useCreateGame).mockReturnValue({
      createGame: mockCreateGame,
      isCreating: false,
    });
  });

  it("sets the header and renders the shared play catalog", () => {
    const screen = renderMobile(<PlayScreen />);

    expect(mockSetHeader).toHaveBeenCalledWith({
      title: "Select Mode",
      eyebrow: "New Game",
    });
    expect(screen.getByText("Classic Mode")).toBeTruthy();
    expect(screen.getByText("Best of Three")).toBeTruthy();
    expect(screen.getByText("Best of Five")).toBeTruthy();
    expect(screen.getByText("Time Challenge")).toBeTruthy();
    expect(screen.getByText("4x4 Grid")).toBeTruthy();
    expect(screen.getByText("6x6 Grid")).toBeTruthy();
  });

  it("creates a game and navigates to the mobile match route", async () => {
    mockCreateGame.mockResolvedValue("game-123");

    const screen = renderMobile(<PlayScreen />);

    fireEvent.press(screen.getByLabelText("Classic Mode"));

    await waitFor(() => {
      expect(mockCreateGame).toHaveBeenCalledWith({
        gridSize: 3,
        winLength: 3,
        matchFormat: "single",
      });
    });

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/match",
      params: { gameId: "game-123" },
    });
  });

  it("does not start another selection while the shared flow is busy", () => {
    jest.mocked(useCreateGame).mockReturnValue({
      createGame: mockCreateGame,
      isCreating: true,
    });

    const screen = renderMobile(<PlayScreen />);

    fireEvent.press(screen.getByLabelText("Classic Mode"));

    expect(mockCreateGame).not.toHaveBeenCalled();
  });

  it("clears the header on unmount", () => {
    const screen = renderMobile(<PlayScreen />);

    screen.unmount();

    expect(mockSetHeader).toHaveBeenLastCalledWith(null);
  });
});
