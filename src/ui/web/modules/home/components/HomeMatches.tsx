import { Activity } from "react";

import type { Game } from "@/domain/entities/Game";
import { useHomeMatchSections } from "@/ui/shared/home/hooks/useHomeMatchSections";
import { P } from "@/ui/web/components/Typography";
import { HomeMatchCard } from "@/ui/web/modules/home/components/HomeMatchCard";
import { HomeSectionLabel } from "@/ui/web/modules/home/components/HomeSectionLabel";

type HomeMatchesProps = {
  endedGames: Game[];
};

export const HomeMatches = ({ endedGames }: HomeMatchesProps) => {
  const sections = useHomeMatchSections(endedGames);

  return (
    <div className="flex flex-col gap-5 pr-2">
      {sections.map((section) => (
        <div className="flex flex-col gap-5" key={section.id}>
          <HomeSectionLabel text={section.title} />
          <div className="space-y-5">
            {section.matches.map((match) => (
              <HomeMatchCard key={match.id} {...match} />
            ))}
            <Activity
              name={`${section.id}-empty`}
              mode={
                section.emptyMessage && section.matches.length === 0
                  ? "visible"
                  : "hidden"
              }
            >
              <P className="mt-0! text-sm font-semibold text-muted-foreground">
                {section.emptyMessage}
              </P>
            </Activity>
          </div>
        </div>
      ))}
    </div>
  );
};
