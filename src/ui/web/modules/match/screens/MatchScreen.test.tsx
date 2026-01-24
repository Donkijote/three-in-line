import { render, screen } from "@testing-library/react";

import { MatchScreen } from "./MatchScreen";

let isDesktop = false;

vi.mock("@/ui/web/hooks/useMediaQuery", () => ({
  useMediaQuery: () => ({ isDesktop }),
}));

vi.mock("@/ui/web/modules/match/components/PlayerCard", () => ({
  PlayerCard: () => <div data-testid="player-card" />,
}));

vi.mock("@/ui/web/modules/match/components/MatchBoard", () => ({
  MatchBoard: () => <div data-testid="match-board" />,
}));

vi.mock("@/ui/web/modules/match/components/MatchActions", () => ({
  MatchActions: ({ variant }: { variant?: string }) => (
    <div data-testid="match-actions" data-variant={variant ?? "default"} />
  ),
}));

describe("MatchScreen", () => {
  it("renders desktop layout with HUD actions", () => {
    isDesktop = true;
    render(<MatchScreen />);

    expect(screen.getAllByTestId("player-card")).toHaveLength(2);
    expect(screen.getByTestId("match-board")).toBeInTheDocument();
    expect(screen.getByTestId("match-actions")).toHaveAttribute(
      "data-variant",
      "hud",
    );
  });

  it("renders mobile layout with default actions", () => {
    isDesktop = false;
    render(<MatchScreen />);

    expect(screen.getAllByTestId("player-card")).toHaveLength(2);
    expect(screen.getByTestId("match-board")).toBeInTheDocument();
    expect(screen.getByTestId("match-actions")).toHaveAttribute(
      "data-variant",
      "default",
    );
  });
});
