import { createGame } from "@/test/factories/game";
import { renderMobile } from "@/test/mobile/render";

import { HomeScreen } from "./HomeScreen";

const mockUseRecentGamesQuery = jest.fn();
const mockSetHeader = jest.fn();
const mockHomeStats = jest.fn();
const mockHomeMatches = jest.fn();

jest.mock("@/infrastructure/convex/GameApi", () => ({
  useRecentGamesQuery: () => mockUseRecentGamesQuery(),
}));

jest.mock("@/ui/mobile/application/providers/MobileHeaderProvider", () => ({
  useMobileHeader: () => ({
    setHeader: mockSetHeader,
  }),
}));

jest.mock("@/ui/mobile/modules/home/components/HomeStats", () => {
  const { createTextStub } = require("@/test/mobile/componentMocks");

  return {
    HomeStats: createTextStub(
      "home-stats",
      ({ endedGames }: { endedGames: unknown[] }) => {
        mockHomeStats(endedGames);
      },
    ),
  };
});

jest.mock("@/ui/mobile/modules/home/components/HomeMatches", () => {
  const { createTextStub } = require("@/test/mobile/componentMocks");

  return {
    HomeMatches: createTextStub(
      "home-matches",
      ({ endedGames }: { endedGames: unknown[] }) => {
        mockHomeMatches(endedGames);
      },
    ),
  };
});

describe("HomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sets the header and passes recent ended games to its sections", () => {
    const recentGames = [createGame({ id: "game-1" })];
    mockUseRecentGamesQuery.mockReturnValue(recentGames);

    const screen = renderMobile(<HomeScreen />);

    expect(mockSetHeader).toHaveBeenCalledWith({
      title: "Match History",
      eyebrow: "Mission Logs",
    });
    expect(mockHomeStats).toHaveBeenCalledWith(recentGames);
    expect(mockHomeMatches).toHaveBeenCalledWith(recentGames);
    expect(screen.getByText("home-stats")).toBeTruthy();
    expect(screen.getByText("home-matches")).toBeTruthy();
    expect(screen.getByText("No more logs found")).toBeTruthy();
  });

  it("falls back to an empty list and clears the header on unmount", () => {
    mockUseRecentGamesQuery.mockReturnValue(null);

    const screen = renderMobile(<HomeScreen />);

    expect(mockHomeStats).toHaveBeenCalledWith([]);
    expect(mockHomeMatches).toHaveBeenCalledWith([]);

    screen.unmount();

    expect(mockSetHeader).toHaveBeenLastCalledWith(null);
  });
});
