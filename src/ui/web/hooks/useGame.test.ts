import { renderHook } from "@testing-library/react";

import { useGame } from "./useGame";

const { useQueryMock, apiMock } = vi.hoisted(() => ({
  useQueryMock: vi.fn(),
  apiMock: {
    games: {
      getGame: "games.getGame",
    },
  },
}));

vi.mock("convex/react", () => ({
  useQuery: useQueryMock,
}));

vi.mock("@/convex/_generated/api", () => ({
  api: apiMock,
}));

vi.mock("@/infrastructure/convex/repository/gameRepository", () => ({
  gameRepository: {
    heartbeat: vi.fn(),
  },
}));

describe("useGame", () => {
  beforeEach(() => {
    useQueryMock.mockReset();
  });

  it("skips the query when no game id is provided", () => {
    useQueryMock.mockReturnValue(null);

    const { result } = renderHook(() => useGame(null));

    expect(useQueryMock).toHaveBeenCalledWith(apiMock.games.getGame, "skip");
    expect(result.current).toBe(null);
  });

  it("fetches game data when a game id is provided", () => {
    const response = { id: "game-1" };
    useQueryMock.mockReturnValue(response);

    const { result } = renderHook(() => useGame("game-1"));

    expect(useQueryMock).toHaveBeenCalledWith(apiMock.games.getGame, {
      gameId: "game-1",
    });
    expect(result.current).toEqual(response);
  });
});
