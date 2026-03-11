import { View } from "react-native";

import type { Game } from "@/domain/entities/Game";
import { Muted } from "@/ui/mobile/components/Typography";
import { Visibility } from "@/ui/mobile/layout/components/Visibility";
import { HomeMatchCard } from "@/ui/mobile/modules/home/components/HomeMatchCard";
import { HomeSectionLabel } from "@/ui/mobile/modules/home/components/HomeSectionLabel";
import { useHomeMatches } from "@/ui/shared/home/hooks/useHomeMatches";

type HomeMatchesProps = {
  endedGames: Game[];
};

export const HomeMatches = ({ endedGames }: HomeMatchesProps) => {
  const { recentMatches, previousWeekMatches } = useHomeMatches(endedGames);

  return (
    <View className="gap-5 pr-1">
      <HomeSectionLabel text="Recent Matches" />
      <View className="gap-4">
        {recentMatches.map((match) => (
          <HomeMatchCard key={match.id} {...match} />
        ))}
        <Visibility visible={recentMatches.length === 0}>
          <Muted className="mt-0 text-sm font-semibold text-muted-foreground">
            No recent matches in the last 7 days.
          </Muted>
        </Visibility>
      </View>

      <HomeSectionLabel text="Previous Week" />
      <View className="gap-4">
        {previousWeekMatches.map((match) => (
          <HomeMatchCard key={match.id} {...match} />
        ))}
      </View>
    </View>
  );
};
