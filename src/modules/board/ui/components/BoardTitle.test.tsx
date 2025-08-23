import { afterAll } from "vitest";

import { StorageKeys, StorageService } from "@/application/storage-service";
import { GameState } from "@/modules/board/types";
import { BoardTitle } from "@/modules/board/ui/components/BoardTitle";

import { render, screen } from "@testing-library/react";

describe("Board Title", () => {
  afterAll(() => {
    StorageService.remove(StorageKeys.USER_SETTINGS);
  });

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

  test("Render user name from storage", () => {
    StorageService.set(StorageKeys.USER_SETTINGS, { name: "test" });
    render(<BoardTitle isPlayerTurn={true} gameState={GameState.PROGRESS} />);

    expect(screen.getByTestId("BoardTitle")).toBeInTheDocument();

    const title = screen.getByTestId("BoardTitle-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("test Turn!");
  });
});
