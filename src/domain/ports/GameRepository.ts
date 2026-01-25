import type { GameId, GameState } from "@/domain/entities/Game";
import type { GameConfig } from "@/domain/entities/GameConfig";

export type Game = GameState &
  GameConfig & {
    id: GameId;
  };

export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};

export interface GameRepository {
  /**
   * Find an existing waiting game for the config or create a new one.
   */
  findOrCreateGame: (config: GameConfig) => Promise<GameId>;
  getGame: (gameId: GameId) => Promise<Game | null>;

  /**
   * Apply a move for the current user; rejects invalid turns or indices.
   */
  placeMark: (params: { gameId: GameId; index: number }) => Promise<void>;
  /**
   * Reset the current game state while preserving its config.
   */
  restartGame: (params: { gameId: GameId }) => Promise<void>;
  /**
   * Abandoning intentionally deletes the game server-side.
   */
  abandonGame: (params: { gameId: GameId }) => Promise<void>;

  /**
   * Record presence/heartbeat; may resume paused games when both are online.
   */
  heartbeat: (params: { gameId: GameId }) => Promise<void>;

  listWaitingGames: (params?: {
    config?: GameConfig;
    limit?: number;
  }) => Promise<Game[]>;
  listMyActiveGames: (params?: { limit?: number }) => Promise<Game[]>;

  listMyMatchHistory: (params?: {
    limit?: number;
    cursor?: string | null;
  }) => Promise<CursorPage<Game>>;
}
