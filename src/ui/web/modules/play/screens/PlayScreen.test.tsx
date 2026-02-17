import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { findOrCreateGameUseCase } from "@/application/games/findOrCreateGameUseCase";
import { gameRepository } from "@/infrastructure/convex/repository/gameRepository";

import { PlayScreen } from "./PlayScreen";

const navigateMock = vi.fn();

const invokeReactClick = (element: HTMLElement) => {
  const propsKey = Object.keys(element).find((key) =>
    key.startsWith("__reactProps$"),
  );
  if (!propsKey) {
    throw new Error("React props key not found");
  }
  const reactProps = (
    element as unknown as Record<string, { onClick?: () => void }>
  )[propsKey];
  reactProps.onClick?.();
};

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("@/application/games/findOrCreateGameUseCase", () => ({
  findOrCreateGameUseCase: vi.fn(),
}));

describe("PlayScreen", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    vi.mocked(findOrCreateGameUseCase).mockReset();
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
    vi.mocked(findOrCreateGameUseCase).mockResolvedValue("game-123");
    render(<PlayScreen />);

    fireEvent.click(screen.getByRole("button", { name: /classic mode/i }));

    await waitFor(() => {
      expect(findOrCreateGameUseCase).toHaveBeenCalledWith(gameRepository, {
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

  it("prevents duplicate submissions while creating a game", async () => {
    let resolveCall: ((value: string) => void) | null = null;
    vi.mocked(findOrCreateGameUseCase).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveCall = resolve;
        }),
    );
    render(<PlayScreen />);

    const classicModeButton = screen.getByRole("button", {
      name: /classic mode/i,
    });
    fireEvent.click(classicModeButton);

    await waitFor(() => {
      expect(classicModeButton).toBeDisabled();
    });

    fireEvent.click(screen.getByRole("button", { name: /best of three/i }));

    expect(findOrCreateGameUseCase).toHaveBeenCalledTimes(1);

    invokeReactClick(classicModeButton);
    expect(findOrCreateGameUseCase).toHaveBeenCalledTimes(1);

    resolveCall?.("game-999");
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({
        to: "/match",
        search: { gameId: "game-999" },
      });
    });
  });
});
