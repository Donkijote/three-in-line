import { createGame } from "@/test/factories/game";
import { renderMobile } from "@/test/mobile/render";

import { HomeStats } from "./HomeStats";

const mockUseHomeStats = jest.fn();

jest.mock("@/ui/shared/home/hooks/useHomeStats", () => ({
  useHomeStats: (endedGames: unknown[]) => mockUseHomeStats(endedGames),
}));

jest.mock("@/ui/mobile/modules/home/components/HomeStatCard", () => {
  const { createTextStub } = require("@/test/mobile/componentMocks");

  return {
    HomeStatCard: createTextStub(
      ({ label, value }: { label: string; value: string }) =>
        `${label}:${value}`,
    ),
  };
});

describe("HomeStats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("maps the shared home stats view model into stat cards", () => {
    const endedGames = [createGame({ id: "game-1" }), createGame({ id: "game-2" })];
    mockUseHomeStats.mockReturnValue([
      { id: "wins", label: "Wins", value: "4", accent: "primary" },
      { id: "streak", label: "Streak", value: "2", accent: "warning" },
    ]);

    const screen = renderMobile(<HomeStats endedGames={endedGames} />);

    expect(mockUseHomeStats).toHaveBeenCalledWith(endedGames);
    expect(screen.getByText("Wins:4")).toBeTruthy();
    expect(screen.getByText("Streak:2")).toBeTruthy();
  });
});
