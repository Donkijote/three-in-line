import { render, screen } from "@testing-library/react";

import { PlayerCard } from "./PlayerCard";

describe("PlayerCard", () => {
  it("renders player details", () => {
    render(
      <PlayerCard
        name="Alex"
        symbol="X"
        wins={3}
        showWins={true}
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
        showWins={true}
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
        showWins={true}
        isTurn={false}
        avatar="/avatars/avatar-8.svg"
        accent={"opponent"}
      />,
    );

    expect(screen.getByText("Turn")).not.toBeVisible();
  });

  it("uses destructive colors when the timer is urgent", () => {
    const { container } = render(
      <PlayerCard
        name="Sam"
        symbol="O"
        wins={2}
        showWins={true}
        isTurn={true}
        avatar="/avatars/avatar-8.svg"
        accent={"opponent"}
        turnTimer={{ isActive: true, progress: 0.05 }}
      />,
    );

    const timerSvg = container.querySelector("svg[style]");

    expect(timerSvg).not.toBeNull();
    expect(timerSvg?.getAttribute("style")).toContain(
      "--timer-color: var(--color-destructive)",
    );
    expect(timerSvg?.getAttribute("style")).toContain(
      "--timer-shadow-color: var(--destructive)",
    );
  });
});
