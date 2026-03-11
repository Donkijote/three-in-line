import type { Game, PlayerSlot } from "@/domain/entities/Game";
import type { HomeMatch } from "@/ui/shared/home/types/types";
import { useCurrentUser } from "@/ui/shared/user/hooks/useUser";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const toOutcomeStatus = (game: Game, viewerSlot: PlayerSlot | null) => {
  if (game.endedReason === "draw" || game.winner === null || !viewerSlot) {
    return "stalemate" as const;
  }

  return game.winner === viewerSlot ? "victory" : "defeat";
};

const toModeLabel = (game: Game) => {
  if (game.turnDurationMs !== null) {
    return "Timed Challenge";
  }

  if (game.match.format === "bo3") {
    return "Best of Three";
  }

  if (game.match.format === "bo5") {
    return "Best of Five";
  }

  if (game.gridSize > 3) {
    return "Tactical Grid Mode";
  }

  return "Classic Mode";
};

const toMatchTime = (timestamp: number) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(timestamp);
};

const resolveViewerSlot = (
  game: Game,
  currentUserId: string | undefined,
): PlayerSlot | null => {
  if (!currentUserId) {
    return null;
  }

  return game.p1UserId === currentUserId ? "P1" : "P2";
};

const resolveOpponentUserId = (
  game: Game,
  currentUserId: string | undefined,
) => {
  if (!currentUserId) {
    return game.p2UserId ?? game.p1UserId;
  }

  return game.p1UserId === currentUserId ? game.p2UserId : game.p1UserId;
};

export const useHomeMatches = (endedGames: Game[]) => {
  const currentUser = useCurrentUser();
  const currentUserId = currentUser?.id;
  const now = Date.now();
  const recentMatches: HomeMatch[] = [];
  const previousWeekMatches: HomeMatch[] = [];

  for (const game of endedGames) {
    const viewerSlot = resolveViewerSlot(game, currentUserId);
    const status = toOutcomeStatus(game, viewerSlot);
    const match: HomeMatch = {
      id: game.id,
      status,
      time: toMatchTime(game.updatedTime),
      opponentUserId: resolveOpponentUserId(game, currentUserId),
      subtitle: toModeLabel(game),
    };

    if (now - game.updatedTime <= WEEK_MS) {
      recentMatches.push(match);
      continue;
    }

    previousWeekMatches.push(match);
  }

  return { recentMatches, previousWeekMatches };
};
