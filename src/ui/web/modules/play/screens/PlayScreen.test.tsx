import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { useCreateGame } from "@/ui/shared/play/hooks/useCreateGame";

import { PlayScreen } from "./PlayScreen";

const navigateMock = vi.fn();
const createGameMock = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("@/ui/shared/play/hooks/useCreateGame", () => ({
  useCreateGame: vi.fn(),
}));

describe("PlayScreen", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    createGameMock.mockReset();
    vi.mocked(useCreateGame).mockReturnValue({
      createGame: createGameMock,
      isCreating: false,
    });
  });

  it("renders all game modes", () => {
    render(<PlayScreen />);

    expect(screen.getByText("Classic Mode")).toBeInTheDocument();
    expect(screen.getByText("Best of Three")).toBeInTheDocument();
    expect(screen.getByText("Best of Five")).toBeInTheDocument();
    expect(screen.getByText("Time Challenge")).toBeInTheDocument();
    expect(screen.getByText("4x4 Grid")).toBeInTheDocument();
    expect(screen.getByText("6x6 Grid")).toBeInTheDocument();
  });

  it("creates and navigates to match when selecting a mode", async () => {
    createGameMock.mockResolvedValue("game-123");
    render(<PlayScreen />);

    fireEvent.click(screen.getByRole("button", { name: /classic mode/i }));

    await waitFor(() => {
      expect(createGameMock).toHaveBeenCalledWith({
        gridSize: 3,
        winLength: 3,
        matchFormat: "single",
      });
    });
    expect(navigateMock).toHaveBeenCalledWith({
      to: "/match",
      search: { gameId: "game-123" },
    });
  });

  it("does not navigate when the shared create flow returns null", async () => {
    createGameMock.mockResolvedValue(null);
    render(<PlayScreen />);

    fireEvent.click(screen.getByRole("button", { name: /classic mode/i }));

    await waitFor(() => {
      expect(createGameMock).toHaveBeenCalledTimes(1);
    });

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("disables mode buttons while the shared create flow is busy", () => {
    vi.mocked(useCreateGame).mockReturnValue({
      createGame: createGameMock,
      isCreating: true,
    });

    render(<PlayScreen />);

    expect(
      screen.getByRole("button", { name: /classic mode/i }),
    ).toBeDisabled();
  });
});
