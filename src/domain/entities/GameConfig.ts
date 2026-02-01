import type { GameConfig } from "./Game";

export type { GameConfig } from "./Game";

import { GameConfigError } from "./GameErrors";

/**
 * Default grid size when none is provided.
 */
export const DEFAULT_GRID_SIZE = 3;
/**
 * Default win length when none is provided.
 */
export const DEFAULT_WIN_LENGTH = 3;

/**
 * Normalize and validate config values.
 */
export const resolveConfig = (input?: Partial<GameConfig>): GameConfig => {
  const gridSize = input?.gridSize ?? DEFAULT_GRID_SIZE;
  const winLength = input?.winLength ?? DEFAULT_WIN_LENGTH;
  const matchFormat = input?.matchFormat;
  const isTimed = input?.isTimed;

  if (!Number.isInteger(gridSize) || gridSize <= 0) {
    throw new GameConfigError("Grid size must be a positive integer");
  }
  if (!Number.isInteger(winLength) || winLength <= 0 || winLength > gridSize) {
    throw new GameConfigError(
      "Win length must be a positive integer within grid size",
    );
  }

  return { gridSize, winLength, matchFormat, isTimed };
};
