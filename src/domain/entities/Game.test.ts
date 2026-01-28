import {
  applyMove,
  type BoardCell,
  createEmptyBoard,
  createInitialState,
  evaluateWinner,
  GameConfigError,
  GameMoveError,
  GameRuleError,
  type GameState,
  generateWinLines,
  resolveConfig,
} from "./Game";

describe("Game domain", () => {
  describe("resolveConfig", () => {
    it("defaults to 3x3 win-3", () => {
      expect(resolveConfig()).toEqual({ gridSize: 3, winLength: 3 });
    });

    it("rejects invalid grid size", () => {
      expect(() => resolveConfig({ gridSize: 0, winLength: 3 })).toThrow(
        GameConfigError,
      );
    });

    it("rejects win length larger than grid size", () => {
      expect(() => resolveConfig({ gridSize: 3, winLength: 4 })).toThrow(
        GameConfigError,
      );
    });
  });

  describe("generateWinLines", () => {
    const containsLine = (lines: number[][], target: number[]) => {
      return lines.some(
        (line) =>
          line.length === target.length &&
          (line.every((value, index) => value === target[index]) ||
            line.every(
              (value, index) => value === target[target.length - 1 - index],
            )),
      );
    };

    it("generates the 3x3 win-3 lines", () => {
      const lines = generateWinLines({ gridSize: 3, winLength: 3 });
      expect(lines).toHaveLength(8);
      expect(lines).toContainEqual([0, 1, 2]);
      expect(lines).toContainEqual([0, 3, 6]);
      expect(lines).toContainEqual([0, 4, 8]);
      expect(containsLine(lines, [2, 4, 6])).toBe(true);
    });

    it("generates 4x4 win-4 lines", () => {
      const lines = generateWinLines({ gridSize: 4, winLength: 4 });
      expect(lines).toHaveLength(10);
      expect(lines).toContainEqual([0, 1, 2, 3]);
      expect(lines).toContainEqual([0, 4, 8, 12]);
      expect(lines).toContainEqual([0, 5, 10, 15]);
      expect(containsLine(lines, [3, 6, 9, 12])).toBe(true);
    });
  });

  describe("evaluateWinner", () => {
    it("detects a horizontal winner", () => {
      const board = [
        "P1",
        "P1",
        "P1",
        null,
        null,
        null,
        null,
        null,
        null,
      ] as BoardCell[];
      expect(evaluateWinner(board, { gridSize: 3, winLength: 3 })).toEqual({
        winner: "P1",
        line: [0, 1, 2],
      });
    });

    it("detects a diagonal winner", () => {
      const board = [
        "P2",
        null,
        null,
        null,
        null,
        "P2",
        null,
        null,
        null,
        null,
        "P2",
        null,
        null,
        null,
        null,
        "P2",
      ] as BoardCell[];
      expect(evaluateWinner(board, { gridSize: 4, winLength: 4 })).toEqual({
        winner: "P2",
        line: [0, 5, 10, 15],
      });
    });
  });

  describe("applyMove", () => {
    const config = resolveConfig({ gridSize: 3, winLength: 3 });

    it("prevents moves before the game starts", () => {
      const state = createInitialState(config);
      expect(() => applyMove(state, 0, "P1", config)).toThrow(GameRuleError);
    });

    it("prevents moves after the game ends", () => {
      const state = {
        ...createInitialState(config),
        status: "ended",
        winner: "P1",
        winningLine: [0, 1, 2],
      } as GameState;
      expect(() => applyMove(state, 0, "P1", config)).toThrow(GameRuleError);
    });

    it("rejects moves from the wrong player", () => {
      const state = {
        ...createInitialState(config),
        status: "playing",
      } as GameState;
      expect(() => applyMove(state, 0, "P2", config)).toThrow(GameMoveError);
    });

    it("rejects invalid indexes", () => {
      const state = {
        ...createInitialState(config),
        status: "playing",
      } as GameState;
      expect(() => applyMove(state, 9, "P1", config)).toThrow(GameMoveError);
    });

    it("rejects moves on occupied cells", () => {
      const state = {
        ...createInitialState(config),
        status: "playing",
        board: ["P1", null, null, null, null, null, null, null, null],
      } as GameState;
      expect(() => applyMove(state, 0, "P1", config)).toThrow(GameMoveError);
    });

    it("ends the game when a player wins", () => {
      const state = {
        ...createInitialState(config),
        status: "playing",
        board: ["P1", "P1", null, null, null, null, null, null, null],
        currentTurn: "P1",
        movesCount: 2,
      } as GameState;
      const nextState = applyMove(state, 2, "P1", config);
      expect(nextState.status).toBe("ended");
      expect(nextState.winner).toBe("P1");
      expect(nextState.winningLine).toEqual([0, 1, 2]);
    });

    it("ends the game as a draw when the board is full", () => {
      const state = {
        ...createInitialState(config),
        status: "playing",
        board: ["P1", "P2", "P1", "P1", "P2", "P2", "P2", "P1", null],
        currentTurn: "P1",
        movesCount: 8,
      } as GameState;
      const nextState = applyMove(state, 8, "P1", config);
      expect(nextState.status).toBe("ended");
      expect(nextState.winner).toBe(null);
      expect(nextState.winningLine).toBe(null);
      expect(nextState.movesCount).toBe(9);
    });

    it("switches turns after a valid move", () => {
      const state = {
        ...createInitialState(config),
        status: "playing",
      } as GameState;
      const nextState = applyMove(state, 0, "P1", config);
      expect(nextState.currentTurn).toBe("P2");
      expect(nextState.movesCount).toBe(1);
    });
  });

  describe("createEmptyBoard", () => {
    it("returns a board matching grid size", () => {
      const board = createEmptyBoard({ gridSize: 4, winLength: 3 });
      expect(board).toHaveLength(16);
      expect(board.every((cell) => cell === null)).toBe(true);
    });
  });
});
