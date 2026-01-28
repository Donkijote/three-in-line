/**
 * Raised when game configuration is invalid.
 */
export class GameConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GameConfigError";
  }
}

/**
 * Raised for general rule violations.
 */
export class GameRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GameRuleError";
  }
}

/**
 * Raised for invalid move attempts.
 */
export class GameMoveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GameMoveError";
  }
}
