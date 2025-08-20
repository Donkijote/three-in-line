import { GameState } from "@/modules/board/types";
import { BoardTitle } from "@/modules/board/ui/components/BoardTitle.tsx";

import { render, screen } from "@testing-library/react";

describe("Board Title", () => {
  test("Render winner title", () => {
    render(<BoardTitle isPlayerTurn={false} gameState={GameState.WIN} />);

    expect(screen.getByTestId("BoardTitle")).toBeInTheDocument();

    const title = screen.getByTestId("BoardTitle-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("You Won!");
  });

  test("Render lost title", () => {
    render(<BoardTitle isPlayerTurn={false} gameState={GameState.LOST} />);

    expect(screen.getByTestId("BoardTitle")).toBeInTheDocument();

    const title = screen.getByTestId("BoardTitle-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("You Lost :(");
  });

  test("Render tied title", () => {
    render(<BoardTitle isPlayerTurn={false} gameState={GameState.TIED} />);

    expect(screen.getByTestId("BoardTitle")).toBeInTheDocument();

    const title = screen.getByTestId("BoardTitle-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("It's a Tied!");
  });
});
