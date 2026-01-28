import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { GameId } from "@/domain/entities/Game";
import type { GameConfig } from "@/domain/entities/GameConfig";
import type { GameRepository } from "@/domain/ports/GameRepository";
import { convexClient } from "@/infrastructure/convex/client";

const toGameId = (id: string) => id as GameId;
const toConvexGameId = (id: GameId) => id as unknown as Id<"games">;

export const gameRepository: GameRepository = {
  findOrCreateGame: async (config: GameConfig) => {
    const result = await convexClient.mutation(
      api.games.findOrCreateGame,
      config,
    );
    return toGameId(result.gameId);
  },
  placeMark: async (params) => {
    await convexClient.mutation(api.games.placeMark, {
      ...params,
      gameId: toConvexGameId(params.gameId),
    });
  },
  restartGame: async (params) => {
    await convexClient.mutation(api.games.restartGame, {
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
