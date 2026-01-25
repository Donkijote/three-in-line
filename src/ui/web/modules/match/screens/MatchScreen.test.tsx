import { render, screen } from "@testing-library/react";

import { MatchScreen } from "./MatchScreen";

let isDesktop = false;
const game:
  | {
      gridSize?: number;
      board: Array<"P1" | "P2" | null>;
    }
  | undefined = {
  gridSize: 3,
  board: ["P1", "P2", null, null, "P1", null, "P2", null, null],
};

vi.mock("@/ui/web/hooks/useMediaQuery", () => ({
  useMediaQuery: () => ({ isDesktop }),
}));

vi.mock("@/ui/web/hooks/useUser", () => ({
  useCurrentUser: () => ({
    id: "user-1",
    username: "You",
    avatar: { type: "preset", value: "avatar-1" },
  }),
  useUserById: () => ({
    id: "user-2",
    username: "Opponent",
    avatar: { type: "preset", value: "avatar-2" },
  }),
}));

vi.mock("@/ui/web/hooks/useGame", () => ({
  useGame: () => game,
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
    render(<MatchScreen gameId="game-1" />);

    expect(screen.getAllByTestId("player-card")).toHaveLength(2);
    expect(screen.getByTestId("match-board")).toBeInTheDocument();
    expect(screen.getByTestId("match-actions")).toHaveAttribute(
      "data-variant",
      "hud",
    );
  });

  it("renders mobile layout with default actions", () => {
    isDesktop = false;
    render(<MatchScreen gameId="game-1" />);

    expect(screen.getAllByTestId("player-card")).toHaveLength(2);
    expect(screen.getByTestId("match-board")).toBeInTheDocument();
    expect(screen.getByTestId("match-actions")).toHaveAttribute(
      "data-variant",
      "default",
    );
  });
});
