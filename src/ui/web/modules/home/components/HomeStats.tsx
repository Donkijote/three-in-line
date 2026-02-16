import type { Game, PlayerSlot } from "@/domain/entities/Game";
import { ScrollArea, ScrollBar } from "@/ui/web/components/ui/scroll-area";
import { useCurrentUser } from "@/ui/web/hooks/useUser";
import { HomeStatCard } from "@/ui/web/modules/home/components/HomeStatCard";
import type { HomeStat } from "@/ui/web/modules/home/components/home.types";

type HomeStatsProps = {
  endedGames: Game[];
};

export const HomeStats = ({ endedGames }: HomeStatsProps) => {
  const currentUser = useCurrentUser();
  const currentUserId = currentUser?.id;
  const wins = endedGames.filter((game) => {
    if (!currentUserId) {
      return false;
    }
    const viewerSlot: PlayerSlot =
      game.p1UserId === currentUserId ? "P1" : "P2";
    return game.winner === viewerSlot;
  }).length;
  const total = endedGames.length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  let streak = 0;
  for (const game of endedGames) {
    if (!currentUserId) {
      break;
    }
    const viewerSlot: PlayerSlot =
      game.p1UserId === currentUserId ? "P1" : "P2";
    if (game.winner !== viewerSlot) {
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

  return (
    <ScrollArea>
      <div className="flex gap-4 overflow-x-auto py-3">
        {stats.map((stat) => (
          <div className="snap-center" key={stat.id}>
            <HomeStatCard {...stat} />
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
