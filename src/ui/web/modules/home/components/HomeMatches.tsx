import { Activity } from "react";

import type { Game } from "@/domain/entities/Game";
import { useHomeMatches } from "@/ui/shared/home/hooks/useHomeMatches";
import { P } from "@/ui/web/components/Typography";
import { HomeMatchCard } from "@/ui/web/modules/home/components/HomeMatchCard";
import { HomeSectionLabel } from "@/ui/web/modules/home/components/HomeSectionLabel";

type HomeMatchesProps = {
  endedGames: Game[];
};

export const HomeMatches = ({ endedGames }: HomeMatchesProps) => {
  const { recentMatches, previousWeekMatches } = useHomeMatches(endedGames);

  return (
    <div className="flex flex-col gap-5 pr-2">
      <HomeSectionLabel text="Recent Matches" />
      <div className="space-y-5">
        {recentMatches.map((match) => (
          <HomeMatchCard key={match.id} {...match} />
        ))}
        <Activity
          name={"recent-empty"}
          mode={recentMatches.length === 0 ? "visible" : "hidden"}
        >
          <P className="mt-0! text-sm font-semibold text-muted-foreground">
            No recent matches in the last 7 days.
          </P>
        </Activity>
      </div>

      <HomeSectionLabel text="Previous Week" />
      <div className="space-y-5">
        {previousWeekMatches.map((match) => (
          <HomeMatchCard key={match.id} {...match} />
        ))}
      </div>
    </div>
  );
};
