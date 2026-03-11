import { View } from "react-native";

import type { Game } from "@/domain/entities/Game";
import { Muted } from "@/ui/mobile/components/Typography";
import { Visibility } from "@/ui/mobile/layout/components/Visibility";
import { HomeMatchCard } from "@/ui/mobile/modules/home/components/HomeMatchCard";
import { HomeSectionLabel } from "@/ui/mobile/modules/home/components/HomeSectionLabel";
import { useHomeMatchSections } from "@/ui/shared/home/hooks/useHomeMatchSections";

type HomeMatchesProps = {
  endedGames: Game[];
};

export const HomeMatches = ({ endedGames }: HomeMatchesProps) => {
  const sections = useHomeMatchSections(endedGames);

  return (
    <View className="gap-5 pr-1">
      {sections.map((section) => (
        <View className="gap-5" key={section.id}>
          <HomeSectionLabel text={section.title} />
          <View className="gap-4">
            {section.matches.map((match) => (
              <HomeMatchCard key={match.id} {...match} />
            ))}
            <Visibility
              visible={Boolean(
                section.emptyMessage && section.matches.length === 0,
              )}
            >
              <Muted className="mt-0 text-sm font-semibold text-muted-foreground">
                {section.emptyMessage}
              </Muted>
            </Visibility>
          </View>
        </View>
      ))}
    </View>
  );
};
