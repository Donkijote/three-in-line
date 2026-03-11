import { ScrollText } from "lucide-react";

import { useRecentGamesQuery } from "@/infrastructure/convex/GameApi";
import { HOME_SCREEN_COPY } from "@/ui/shared/home/constants/constants";
import { Header } from "@/ui/web/components/Header";
import { P } from "@/ui/web/components/Typography";
import { HomeMatches } from "@/ui/web/modules/home/components/HomeMatches";
import { HomeStats } from "@/ui/web/modules/home/components/HomeStats";

export function HomeScreen() {
  const recentGames = useRecentGamesQuery();
  const endedGames = recentGames ?? [];

  return (
    <section className="mx-auto flex max-w-[calc(100svw-2rem)] w-full h-full md:max-w-xl flex-col gap-10 pb-12">
      <Header
        title={HOME_SCREEN_COPY.title}
        eyebrow={HOME_SCREEN_COPY.eyebrow}
      />

      <HomeStats endedGames={endedGames} />

      <HomeMatches endedGames={endedGames} />

      <div className={"flex flex-col items-center justify-center gap-2"}>
        <div className="flex size-14 items-center justify-center rounded-full border bg-card">
          <ScrollText className="size-8 text-foreground/80" />
        </div>
        <P className="text-md font-semibold text-muted-foreground mt-0!">
          {HOME_SCREEN_COPY.noMoreLogs}
        </P>
      </div>
    </section>
  );
}
