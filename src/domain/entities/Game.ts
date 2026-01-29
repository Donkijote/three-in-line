/**
 * Player marker used by the domain (no UI-specific symbols).
 */
export type PlayerSlot = "P1" | "P2";

/**
 * Board cell ownership; null means empty.
 */
export type BoardCell = PlayerSlot | null;

/**
 * Branded id to identify a game instance in ports.
 */
export type GameId = string & { readonly __brand: "GameId" };

/**
 * Supported lifecycle states for a game instance.
 */
export type GameStatus =
  | "waiting"
  | "playing"
  | "paused"
  | "ended"
  | "canceled";

export type MatchFormat = "single" | "bo3" | "bo5";

/**
 * Configurable grid and win requirements.
 */
export type GameConfig = {
  gridSize: number;
  winLength: number;
  matchFormat?: MatchFormat;
};

/**
 * Pure domain state for a game (no backend metadata).
 */
export type GameState = {
  board: BoardCell[];
  currentTurn: PlayerSlot;
  status: GameStatus;
  winner: PlayerSlot | null;
  winningLine: number[] | null;
  movesCount: number;
};

/**
 * Winner summary with the exact winning line.
 */
export type WinnerResult = {
  winner: PlayerSlot;
  line: number[];
};

export {
  DEFAULT_GRID_SIZE,
  DEFAULT_WIN_LENGTH,
  resolveConfig,
} from "./GameConfig";
export { GameConfigError, GameMoveError, GameRuleError } from "./GameErrors";
export {
  applyMove,
  createEmptyBoard,
  createInitialState,
  evaluateWinner,
  generateWinLines,
} from "./GameRules";
