import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export const useGame = (gameId?: string | null) => {
  const resolvedId = gameId ? (gameId as unknown as Id<"games">) : undefined;
  return useQuery(
    api.games.getGame,
    resolvedId ? { gameId: resolvedId } : "skip",
  );
};
