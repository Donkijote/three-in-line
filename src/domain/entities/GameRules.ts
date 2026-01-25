import type {
  BoardCell,
  GameConfig,
  GameState,
  PlayerSlot,
  WinnerResult,
} from "./Game";
import { GameMoveError, GameRuleError } from "./GameErrors";

/**
 * Build all contiguous win lines for the given config.
 */
export const generateWinLines = (config: GameConfig): number[][] => {
  const { gridSize, winLength } = config;
  const lines: number[][] = [];
  const maxStart = gridSize - winLength;

  for (let row = 0; row < gridSize; row += 1) {
    for (let col = 0; col <= maxStart; col += 1) {
      const line: number[] = [];
      for (let offset = 0; offset < winLength; offset += 1) {
        line.push(row * gridSize + col + offset);
      }
      lines.push(line);
    }
  }

  for (let col = 0; col < gridSize; col += 1) {
    for (let row = 0; row <= maxStart; row += 1) {
      const line: number[] = [];
      for (let offset = 0; offset < winLength; offset += 1) {
        line.push((row + offset) * gridSize + col);
      }
      lines.push(line);
    }
  }

  for (let row = 0; row <= maxStart; row += 1) {
    for (let col = 0; col <= maxStart; col += 1) {
      const line: number[] = [];
      for (let offset = 0; offset < winLength; offset += 1) {
        line.push((row + offset) * gridSize + (col + offset));
      }
      lines.push(line);
    }
  }

  for (let row = winLength - 1; row < gridSize; row += 1) {
    for (let col = 0; col <= maxStart; col += 1) {
      const line: number[] = [];
      for (let offset = 0; offset < winLength; offset += 1) {
        line.push((row - offset) * gridSize + (col + offset));
      }
      lines.push(line);
    }
  }

  return lines;
};

const getBoardSize = (config: GameConfig) => config.gridSize * config.gridSize;

/**
 * Allocate an empty board for the config.
 */
export const createEmptyBoard = (config: GameConfig): BoardCell[] => {
  return new Array(getBoardSize(config)).fill(null);
};

/**
 * Build a baseline state with an empty board.
 */
export const createInitialState = (
  config: GameConfig,
  startingPlayer: PlayerSlot = "P1",
): GameState => {
  return {
    board: createEmptyBoard(config),
    currentTurn: startingPlayer,
    status: "waiting",
    winner: null,
    winningLine: null,
    movesCount: 0,
  };
};

/**
 * Evaluate the winner, if any, based on the current board.
 */
export const evaluateWinner = (
  board: BoardCell[],
  config: GameConfig,
): WinnerResult | null => {
  const winLines = generateWinLines(config);
  for (const line of winLines) {
    const slot = board[line[0]];
    if (!slot) {
      continue;
    }
    let isWinner = true;
    for (let index = 1; index < line.length; index += 1) {
      if (board[line[index]] !== slot) {
        isWinner = false;
        break;
      }
    }
    if (isWinner) {
      return { winner: slot, line: [...line] };
    }
  }
  return null;
};

/**
 * Apply a move and return the next state (pure).
 */
export const applyMove = (
  state: GameState,
  index: number,
  player: PlayerSlot,
  config: GameConfig,
): GameState => {
  if (state.status === "ended") {
    throw new GameRuleError("Game has already ended");
  }

  if (state.status === "waiting") {
    throw new GameRuleError("Game has not started");
  }

  if (state.currentTurn !== player) {
    throw new GameMoveError("It is not your turn");
  }

  const boardSize = getBoardSize(config);
  if (!Number.isInteger(index) || index < 0 || index >= boardSize) {
    throw new GameMoveError(
      `Move index must be an integer between 0 and ${boardSize - 1}`,
    );
  }

  if (state.board[index] !== null) {
    throw new GameMoveError("Cell is already occupied");
  }

  const nextBoard = [...state.board];
  nextBoard[index] = player;
  const nextMovesCount = state.movesCount + 1;
  const winnerResult = evaluateWinner(nextBoard, config);

  if (winnerResult) {
    return {
      ...state,
      board: nextBoard,
      status: "ended",
      winner: winnerResult.winner,
      winningLine: winnerResult.line,
      movesCount: nextMovesCount,
    };
  }

  if (nextMovesCount >= boardSize) {
    return {
      ...state,
      board: nextBoard,
      status: "ended",
      winner: null,
      winningLine: null,
      movesCount: nextMovesCount,
    };
  }

  return {
    ...state,
    board: nextBoard,
    currentTurn: player === "P1" ? "P2" : "P1",
    movesCount: nextMovesCount,
  };
};
