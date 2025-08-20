import { GameState } from "@/modules/board/types";

import { render, screen } from "@testing-library/react";

import { NewGameButton } from "./NewGameButton";

describe("New Game Button", () => {
  test("should not render when game state is in progress", () => {
    render(
      <NewGameButton gameState={GameState.PROGRESS} handleRest={() => {}} />,
    );

    expect(screen.queryByRole("button")).toBeNull();
  });
  test("should render when game state is not in progress", () => {
    render(<NewGameButton gameState={GameState.TIED} handleRest={() => {}} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
