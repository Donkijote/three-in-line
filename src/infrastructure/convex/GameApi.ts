import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { GameId as ConvexGameId } from "@/convex/schemas/game";
import type { Game, GameId } from "@/domain/entities/Game";
import { toDomainGame } from "@/infrastructure/convex/repository/gameRepository";

export const useGameById = (
  gameId?: GameId | null,
): Game | null | undefined => {
  const resolvedId = gameId ? (gameId as unknown as ConvexGameId) : undefined;
  const game = useQuery(
    api.games.getGame,
    resolvedId ? { gameId: resolvedId } : "skip",
  );
  return game ? toDomainGame(game) : game;
};

export const useRecentGamesQuery = (): Game[] | undefined => {
  const recentGames = useQuery(api.games.getRecentGames);
  if (!recentGames) {
    return recentGames;
  }

  return recentGames.games.map((game) => toDomainGame(game));
};
