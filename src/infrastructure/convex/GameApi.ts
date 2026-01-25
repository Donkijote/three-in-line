import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export function useGame(gameId: Id<"games"> | undefined) {
  return useQuery(
    api.games.getGame,
    gameId ? { gameId } : "skip",
  );
}

export function useWaitingGames() {
  return useQuery(api.games.listWaitingGames);
}

export function useMyActiveGames() {
  return useQuery(api.games.myActiveGames);
}

export function useCreateGame() {
  return useMutation(api.games.createGame);
}

export function useFindOrCreateGame() {
  return useMutation(api.games.findOrCreateGame);
}

export function useJoinGame() {
  return useMutation(api.games.joinGame);
}

export function usePlaceMark() {
  return useMutation(api.games.placeMark);
}

export function useRestartGame() {
  return useMutation(api.games.restartGame);
}

export function useAbandonGame() {
  return useMutation(api.games.abandonGame);
}

export function useHeartbeat() {
  return useMutation(api.games.heartbeat);
}
