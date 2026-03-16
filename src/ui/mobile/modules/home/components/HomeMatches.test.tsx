import { createGame } from "@/test/factories/game";
import { renderMobile } from "@/test/mobile/render";

import { HomeMatches } from "./HomeMatches";

const mockUseHomeMatchSections = jest.fn();

jest.mock("@/ui/shared/home/hooks/useHomeMatchSections", () => ({
  useHomeMatchSections: (endedGames: unknown[]) =>
    mockUseHomeMatchSections(endedGames),
}));

jest.mock("@/ui/mobile/modules/home/components/HomeMatchCard", () => {
  const { createTextStub } = require("@/test/mobile/componentMocks");

  return {
    HomeMatchCard: createTextStub(({ id }: { id: string }) => `match:${id}`),
  };
});

jest.mock("@/ui/mobile/modules/home/components/HomeSectionLabel", () => {
  const { createTextStub } = require("@/test/mobile/componentMocks");

  return {
    HomeSectionLabel: createTextStub(({ text }: { text: string }) => text),
  };
});

jest.mock("@/ui/mobile/layout/components/Visibility", () => {
  const { createVisibilityStub } = require("@/test/mobile/componentMocks");

  return {
    Visibility: createVisibilityStub(),
  };
});

describe("HomeMatches", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders sections, matches, and empty states from the shared sections model", () => {
    const endedGames = [createGame({ id: "game-1" })];
    mockUseHomeMatchSections.mockReturnValue([
      {
        id: "recent",
        title: "Recent matches",
        emptyMessage: null,
        matches: [{ id: "match-1" }],
      },
      {
        id: "previous",
        title: "Previous week",
        emptyMessage: "No older matches",
        matches: [],
      },
    ]);

    const screen = renderMobile(<HomeMatches endedGames={endedGames} />);

    expect(mockUseHomeMatchSections).toHaveBeenCalledWith(endedGames);
    expect(screen.getByText("Recent matches")).toBeTruthy();
    expect(screen.getByText("match:match-1")).toBeTruthy();
    expect(screen.getByText("Previous week")).toBeTruthy();
    expect(screen.getByText("No older matches")).toBeTruthy();
  });
});
