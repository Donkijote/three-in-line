import { render, screen } from "@testing-library/react";

import { PlayerCard } from "./PlayerCard";

describe("PlayerCard", () => {
  it("renders player details", () => {
    render(
      <PlayerCard
        name="Alex"
        symbol="X"
        wins={3}
        isTurn={true}
        avatar="/avatars/avatar-3.svg"
        accent={"primary"}
      />,
    );

    expect(screen.getByText("Alex")).toBeInTheDocument();
    expect(screen.getByText("(X)")).toBeInTheDocument();
    expect(screen.getByText("Wins: 3")).toBeInTheDocument();
  });

  it("shows the turn badge for the active player", () => {
    render(
      <PlayerCard
        name="Sam"
        symbol="O"
        wins={2}
        isTurn={true}
        avatar="/avatars/avatar-8.svg"
        accent={"primary"}
      />,
    );

    expect(screen.getByText("Turn")).toBeInTheDocument();
  });

  it("hides the turn badge for inactive players", () => {
    render(
      <PlayerCard
        name="Sam"
        symbol="O"
        wins={2}
        isTurn={false}
        avatar="/avatars/avatar-8.svg"
        accent={"opponent"}
      />,
    );

    expect(screen.getByText("Turn")).not.toBeVisible();
  });
});
