import { afterAll } from "vitest";

import { GameStorage, GameStorageService } from "@/application/games-storage.ts";
import { GameState, type GameStorageType } from "@/modules/board/types";

import { checkWinner, DEFAULT_PLAYS, syncGamePlay, syncGamesData } from "./board-logic";

describe("Board Logic", () => {
  afterAll(() => {
    GameStorageService.remove(GameStorage.GAMES);
  });
  test("winner detection", () => {
    const plays = [1, 1, 1, 0, 0, null, null, null, null];
    const result = checkWinner(plays);
    expect(result).toBe(GameState.WIN);
  });
  test("sync game data from local storage with empty key", () => {
    GameStorageService.set(GameStorage.GAMES, []);
    const newGame = syncGamesData();

    expect(newGame).toStrictEqual({
      id: expect.any(String),
      date: expect.any(Date),
      state: GameState.PROGRESS,
      isPlayerTurn: true,
      plays: DEFAULT_PLAYS,
    });
  });
  test("sync game data from local storage with finished game", () => {
    const newGame: GameStorageType = {
      id: new Date().getTime().toString(),
      date: new Date(),
      state: GameState.WIN,
      isPlayerTurn: true,
      plays: [1, 1, 1, 0, 0, null, null, null, null],
    };
    GameStorageService.set(GameStorage.GAMES, [newGame]);
    const data = syncGamesData();

    expect(data).toStrictEqual({
      id: expect.any(String),
      date: expect.any(Date),
      state: GameState.PROGRESS,
      isPlayerTurn: true,
      plays: DEFAULT_PLAYS,
    });
  });
  test("sync game data from local storage with in progress game", () => {
    const newGame: GameStorageType = {
      id: new Date().getTime().toString(),
      date: new Date(),
      state: GameState.PROGRESS,
      isPlayerTurn: true,
      plays: [1, 1, null, 0, 0, null, null, null, null],
    };

    GameStorageService.set(GameStorage.GAMES, [newGame]);
    const data = syncGamesData();

    expect(data).toStrictEqual({ ...newGame, date: data.date });
  });
  test("sync game play to local storage without key", () => {
    GameStorageService.remove(GameStorage.GAMES);
    const mockedStorageServiceSet = vi.spyOn(GameStorageService, "set");

    syncGamePlay(DEFAULT_PLAYS, true, GameState.PROGRESS);

    expect(mockedStorageServiceSet).not.toHaveBeenCalled();
  });
  test("sync game play to local storage with empty key", () => {
    GameStorageService.set(GameStorage.GAMES, []);
    const mockedStorageServiceSet = vi.spyOn(GameStorageService, "set");

    syncGamePlay(DEFAULT_PLAYS, true, GameState.PROGRESS);

    expect(mockedStorageServiceSet).not.toHaveBeenCalled();
  });
  test("sync game play to local storage with finished game", () => {
    const newGame: GameStorageType = {
      id: new Date().getTime().toString(),
      date: new Date(),
      state: GameState.WIN,
      isPlayerTurn: false,
      plays: [1, 1, 1, 0, 0, null, null, null, null],
    };

    GameStorageService.set(GameStorage.GAMES, [newGame]);
    const mockedStorageServiceSet = vi.spyOn(GameStorageService, "set");

    syncGamePlay(DEFAULT_PLAYS, true, GameState.PROGRESS);

    expect(mockedStorageServiceSet).not.toHaveBeenCalled();
  });
});
