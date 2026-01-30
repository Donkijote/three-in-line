/**
 * Player marker used by the domain (no UI-specific symbols).
 */
export type PlayerSlot = "P1" | "P2";

/**
 * Board cell ownership; null means empty.
 */
export type BoardCell = PlayerSlot | null;

/**
 * String id to identify a game instance in ports.
 */
export type GameId = Game["id"];

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
export type GameEndedReason =
  | "win"
  | "draw"
  | "abandoned"
  | "disconnect"
  | null;

export type MatchRoundSummary = {
  roundIndex: number;
  endedReason: GameEndedReason;
  winner: PlayerSlot | null;
  movesCount: number;
  endedTime: number;
};

export type MatchScore = {
  P1: number;
  P2: number;
};

export type MatchState = {
  format: MatchFormat;
  targetWins: number;
  roundIndex: number;
  score: MatchScore;
  matchWinner: PlayerSlot | null;
  rounds: MatchRoundSummary[];
};

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

export type Game = {
  id: string;
  status: GameStatus;
  board: BoardCell[];
  gridSize: number;
  winLength: number;
  match: MatchState;
  p1UserId: string;
  p2UserId: string | null;
  currentTurn: PlayerSlot;
  winner: PlayerSlot | null;
  winningLine: number[] | null;
  endedReason: GameEndedReason;
  endedTime: number | null;
  pausedTime: number | null;
  abandonedBy: PlayerSlot | null;
  presence: {
    P1: { lastSeenTime: number | null };
    P2: { lastSeenTime: number | null };
  };
  movesCount: number;
  version: number;
  lastMove: { index: number; by: PlayerSlot; at: number } | null;
  updatedTime: number;
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
