import { render, screen } from "@testing-library/react";

import { MatchBoard } from "./MatchBoard";

describe("MatchBoard", () => {
  it("renders a 3x3 board", () => {
    const board = [
      ["X", "O", ""],
      ["", "X", ""],
      ["O", "", ""],
    ];

    render(<MatchBoard board={board} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(9);
    expect(screen.getAllByText("X")).toHaveLength(2);
    expect(screen.getAllByText("O")).toHaveLength(2);
  });
});
