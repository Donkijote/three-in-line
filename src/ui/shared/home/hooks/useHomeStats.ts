import type { Game, PlayerSlot } from "@/domain/entities/Game";
import type { HomeStat } from "@/ui/shared/home/types";
import { useCurrentUser } from "@/ui/shared/user/hooks/useUser";

const resolveViewerSlot = (
  game: Game,
  currentUserId: string | undefined,
): PlayerSlot | null => {
  if (!currentUserId) {
    return null;
  }

  return game.p1UserId === currentUserId ? "P1" : "P2";
};

export const useHomeStats = (endedGames: Game[]) => {
  const currentUser = useCurrentUser();
  const currentUserId = currentUser?.id;

  const wins = endedGames.filter((game) => {
    const viewerSlot = resolveViewerSlot(game, currentUserId);
    return viewerSlot ? game.winner === viewerSlot : false;
  }).length;

  const total = endedGames.length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  let streak = 0;
  for (const game of endedGames) {
    const viewerSlot = resolveViewerSlot(game, currentUserId);
    if (!viewerSlot || game.winner !== viewerSlot) {
      break;
    }

    streak += 1;
  }

  const stats: HomeStat[] = [
    { id: "wins", label: "Wins", value: String(wins), accent: "primary" },
    {
      id: "win-rate",
      label: "Win Rate",
      value: `${winRate}%`,
      accent: "opponent",
    },
    {
      id: "streak",
      label: "Streak",
      value: String(streak),
      accent: "warning",
    },
  ];

  return stats;
};
