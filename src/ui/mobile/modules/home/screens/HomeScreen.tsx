import { useEffect } from "react";

import { ScrollText } from "lucide-react-native";
import { View } from "react-native";

import { useRecentGamesQuery } from "@/infrastructure/convex/GameApi";
import { useMobileHeader } from "@/ui/mobile/application/providers/MobileHeaderProvider";
import { P } from "@/ui/mobile/components/Typography";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { HomeMatches } from "@/ui/mobile/modules/home/components/HomeMatches";
import { HomeStats } from "@/ui/mobile/modules/home/components/HomeStats";

export const HomeScreen = () => {
  const { setHeader } = useMobileHeader();
  const recentGames = useRecentGamesQuery();
  const endedGames = recentGames ?? [];

  useEffect(() => {
    setHeader({
      title: "Match History",
      eyebrow: "Mission Logs",
    });

    return () => {
      setHeader(null);
    };
  }, [setHeader]);

  return (
    <View className="flex-1 gap-10 pb-12">
      <HomeStats endedGames={endedGames} />

      <HomeMatches endedGames={endedGames} />

      <View className="items-center justify-center gap-2">
        <View className="size-14 items-center justify-center rounded-full border border-border/60 bg-card">
          <Icon as={ScrollText} className="size-7 text-foreground/80" />
        </View>
        <P className="mt-0 text-base font-semibold text-muted-foreground">
          No more logs found
        </P>
      </View>
    </View>
  );
};
