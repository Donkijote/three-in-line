import type { Game } from "@/domain/entities/Game";
import { useHomeStats } from "@/ui/shared/home/hooks/useHomeStats";
import { ScrollArea, ScrollBar } from "@/ui/web/components/ui/scroll-area";
import { HomeStatCard } from "@/ui/web/modules/home/components/HomeStatCard";

type HomeStatsProps = {
  endedGames: Game[];
};

export const HomeStats = ({ endedGames }: HomeStatsProps) => {
  const stats = useHomeStats(endedGames);

  return (
    <ScrollArea>
      <div className="flex gap-4 overflow-x-auto py-3 px-1">
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
