import { afterAll, beforeAll } from "vitest";

import { StorageKeys, StorageService } from "@/application/storage-service";
import { GameState, type GameStorageType } from "@/modules/board/types";

import { render, screen } from "@testing-library/react";

import { Sidebar } from "./Sidebar";

const newGame: GameStorageType = {
  id: new Date().getTime().toString(),
  date: new Date(),
  state: GameState.WIN,
  isPlayerTurn: true,
  plays: [1, 1, 1, 0, 0, null, null, null, null],
};

describe("Sidebar", () => {
  beforeAll(() => {
    StorageService.set(StorageKeys.GAMES, [
      newGame,
      {
        ...newGame,
        state: GameState.LOST,
        id: new Date(new Date().setMonth(2)).getTime().toString(),
      },
      {
        ...newGame,
        state: GameState.TIED,
        id: new Date(new Date().setMonth(3)).getTime().toString(),
      },
    ]);
    StorageService.set(StorageKeys.USER_SETTINGS, {
      name: "test",
      bot: "bot",
      difficulty: "easy",
    });
  });
  afterAll(() => {
    StorageService.remove(StorageKeys.GAMES);
    StorageService.remove(StorageKeys.USER_SETTINGS);
  });

  test("render matches history", () => {
    render(<Sidebar isOpen={true} />);

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(
      screen.getByTestId(`SidebarElement-match-${newGame.id}-button`),
    ).toBeInTheDocument();
    screen.debug(screen.getByTestId("sidebar"));
  });
  test("render sidebar hidden", () => {
    render(<Sidebar isOpen={false} />);

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toHaveClass("-translate-x-full");
  });
});
