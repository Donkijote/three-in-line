import { renderHook } from "@testing-library/react";

import { useGame } from "./useGame";

const { useGameByIdMock } = vi.hoisted(() => ({
  useGameByIdMock: vi.fn(),
}));

vi.mock("@/infrastructure/convex/GameApi", () => ({
  useGameById: useGameByIdMock,
}));

vi.mock("@/infrastructure/convex/repository/gameRepository", () => ({
  gameRepository: {
    heartbeat: vi.fn(),
  },
}));

describe("useGame", () => {
  beforeEach(() => {
    useGameByIdMock.mockReset();
  });

  it("skips the query when no game id is provided", () => {
    useGameByIdMock.mockReturnValue(null);

    const { result } = renderHook(() => useGame(null));

    expect(useGameByIdMock).toHaveBeenCalledWith(null);
    expect(result.current).toBe(null);
  });

  it("fetches game data when a game id is provided", () => {
    const response = { id: "game-1" };
    useGameByIdMock.mockReturnValue(response);

    const { result } = renderHook(() => useGame("game-1"));

    expect(useGameByIdMock).toHaveBeenCalledWith("game-1");
    expect(result.current).toEqual(response);
  });
});
