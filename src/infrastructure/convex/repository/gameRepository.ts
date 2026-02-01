import { api } from "@/convex/_generated/api";
import type { GameId as ConvexGameId, GameDoc } from "@/convex/schemas/game";
import type { Game, GameId } from "@/domain/entities/Game";
import type { GameConfig } from "@/domain/entities/GameConfig";
import type { GameRepository } from "@/domain/ports/GameRepository";
import { convexClient } from "@/infrastructure/convex/client";

const toConvexGameId = (id: GameId) => id as unknown as ConvexGameId;

export const toDomainGame = (game: GameDoc): Game => ({
  id: game._id,
  status: game.status,
  board: game.board,
  gridSize: game.gridSize,
  winLength: game.winLength,
  match: game.match,
  p1UserId: game.p1UserId,
  p2UserId: game.p2UserId,
  currentTurn: game.currentTurn,
  turnDurationMs: game.turnDurationMs,
  turnDeadlineTime: game.turnDeadlineTime,
  winner: game.winner,
  winningLine: game.winningLine,
  endedReason: game.endedReason,
  endedTime: game.endedTime,
  pausedTime: game.pausedTime,
  abandonedBy: game.abandonedBy,
  presence: game.presence,
  movesCount: game.movesCount,
  version: game.version,
  lastMove: game.lastMove,
  updatedTime: game.updatedTime,
});

export const gameRepository: GameRepository = {
  findOrCreateGame: async (config: GameConfig) => {
    const result = await convexClient.mutation(
      api.games.findOrCreateGame,
      config,
    );
    return result.gameId as GameId;
  },
  placeMark: async (params) => {
    await convexClient.mutation(api.games.placeMark, {
      ...params,
      gameId: toConvexGameId(params.gameId),
    });
  },
  abandonGame: async (params) => {
    await convexClient.mutation(api.games.abandonGame, {
      ...params,
      gameId: toConvexGameId(params.gameId),
    });
  },
  heartbeat: async (params) => {
    await convexClient.mutation(api.games.heartbeat, {
      ...params,
      gameId: toConvexGameId(params.gameId),
    });
  },
};
