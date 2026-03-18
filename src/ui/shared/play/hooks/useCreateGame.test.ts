import { act, renderHook } from "@testing-library/react";

import { findOrCreateGameUseCase } from "@/application/games/findOrCreateGameUseCase";
import { gameRepository } from "@/infrastructure/convex/repository/gameRepository";

import { useCreateGame } from "./useCreateGame";

vi.mock("@/application/games/findOrCreateGameUseCase", () => ({
  findOrCreateGameUseCase: vi.fn(),
}));

describe("useCreateGame", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a game through the shared repository path", async () => {
    const config = {
      gridSize: 3,
      winLength: 3,
      matchFormat: "single" as const,
    };
    vi.mocked(findOrCreateGameUseCase).mockResolvedValue("game-123");

    const { result } = renderHook(() => useCreateGame());

    let gameId: string | null = null;

    await act(async () => {
      gameId = await result.current.createGame(config);
    });

    expect(gameId).toBe("game-123");
    expect(findOrCreateGameUseCase).toHaveBeenCalledWith(
      gameRepository,
      config,
    );
    expect(result.current.isCreating).toBe(false);
  });

  it("ignores duplicate requests while a game is being created", async () => {
    const config = {
      gridSize: 3,
      winLength: 3,
      matchFormat: "single" as const,
    };
    let resolveRequest: (value: string) => void = () => {
      throw new Error("resolveRequest not initialized");
    };
    vi.mocked(findOrCreateGameUseCase).mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          resolveRequest = resolve;
        }),
    );

    const { result } = renderHook(() => useCreateGame());

    let firstRequest!: Promise<string | null>;

    act(() => {
      firstRequest = result.current.createGame(config);
    });

    expect(result.current.isCreating).toBe(true);

    let secondResult: string | null = "unexpected";

    await act(async () => {
      secondResult = await result.current.createGame(config);
    });

    expect(secondResult).toBeNull();
    expect(findOrCreateGameUseCase).toHaveBeenCalledTimes(1);

    let firstResult: string | null = null;

    await act(async () => {
      resolveRequest("game-999");
      firstResult = await firstRequest;
    });

    expect(firstResult).toBe("game-999");
    expect(result.current.isCreating).toBe(false);
  });
});
