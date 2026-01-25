import { render, screen } from "@testing-library/react";

import { MatchBoard } from "./MatchBoard";

describe("MatchBoard", () => {
  it("renders a 3x3 board", () => {
    const board = [
      "P1",
      "P2",
      null,
      null,
      "P1",
      null,
      "P2",
      null,
      null,
    ] as const;

    render(<MatchBoard board={[...board]} gridSize={3} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(9);
    expect(screen.getAllByText("X")).toHaveLength(2);
    expect(screen.getAllByText("O")).toHaveLength(2);
  });
});
