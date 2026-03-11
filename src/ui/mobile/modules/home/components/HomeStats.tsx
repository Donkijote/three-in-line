import type { Game } from "@/domain/entities/Game";
import { ScrollArea } from "@/ui/mobile/components/ui/scroll-area";
import { HomeStatCard } from "@/ui/mobile/modules/home/components/HomeStatCard";
import { useHomeStats } from "@/ui/shared/home/hooks/useHomeStats";

type HomeStatsProps = {
  endedGames: Game[];
};

export const HomeStats = ({ endedGames }: HomeStatsProps) => {
  const stats = useHomeStats(endedGames);

  return (
    <ScrollArea
      horizontal
      className="mx-[-4px] flex-none"
      contentContainerClassName="gap-4 px-1 py-2"
      showsHorizontalScrollIndicator={false}
    >
      {stats.map((stat) => (
        <HomeStatCard key={stat.id} {...stat} />
      ))}
    </ScrollArea>
  );
};
