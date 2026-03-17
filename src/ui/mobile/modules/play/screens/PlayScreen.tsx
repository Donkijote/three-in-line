import { useEffect, useState } from "react";

import { router } from "expo-router";
import type { LucideIcon } from "lucide-react-native";
import {
  ChevronRight,
  Clock,
  Grid2x2,
  Grid3x3,
  Hash,
  Medal,
  Trophy,
} from "lucide-react-native";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { useMobileHeader } from "@/ui/mobile/application/providers/MobileHeaderProvider";
import { H3, H6, Muted } from "@/ui/mobile/components/Typography";
import { Card, CardContent } from "@/ui/mobile/components/ui/card";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { cn } from "@/ui/mobile/lib/utils";
import {
  PLAY_MODES,
  PLAY_SCREEN_CONTENT,
  type PlayMode,
} from "@/ui/shared/play/constants/modes";
import { useCreateGame } from "@/ui/shared/play/hooks/useCreateGame";

const modeIcons: Record<PlayMode["icon"], LucideIcon> = {
  hash: Hash,
  trophy: Trophy,
  medal: Medal,
  clock: Clock,
  "grid-4": Grid2x2,
  "grid-6": Grid3x3,
};

const modeStyles: Record<
  PlayMode["tone"],
  { badge: string; badgeIcon: string; halo: string }
> = {
  emerald: {
    badge: "bg-emerald-500/10",
    badgeIcon: "text-emerald-500",
    halo: "bg-emerald-500/10",
  },
  yellow: {
    badge: "bg-yellow-500/10",
    badgeIcon: "text-yellow-500",
    halo: "bg-yellow-500/10",
  },
  fuchsia: {
    badge: "bg-fuchsia-500/10",
    badgeIcon: "text-fuchsia-500",
    halo: "bg-fuchsia-500/10",
  },
  orange: {
    badge: "bg-orange-500/10",
    badgeIcon: "text-orange-500",
    halo: "bg-orange-500/10",
  },
  sky: {
    badge: "bg-sky-500/10",
    badgeIcon: "text-sky-500",
    halo: "bg-sky-500/10",
  },
  violet: {
    badge: "bg-violet-500/10",
    badgeIcon: "text-violet-500",
    halo: "bg-violet-500/10",
  },
};

export const PlayScreen = () => {
  const { setHeader } = useMobileHeader();
  const { createGame, isCreating } = useCreateGame();
  const [pendingModeId, setPendingModeId] = useState<string | null>(null);

  useEffect(() => {
    setHeader({
      title: PLAY_SCREEN_CONTENT.title,
      eyebrow: PLAY_SCREEN_CONTENT.eyebrow,
    });

    return () => {
      setHeader(null);
    };
  }, [setHeader]);

  const handleSelectMode = async (mode: PlayMode) => {
    setPendingModeId(mode.id);

    try {
      const gameId = await createGame(mode.config);

      if (!gameId) {
        return;
      }

      router.push({
        pathname: "/match",
        params: { gameId },
      });
    } finally {
      setPendingModeId(null);
    }
  };

  return (
    <View className="flex-1 gap-8 pb-12">
      <View className="gap-2 pt-4">
        <H3 className="text-center text-xl">{PLAY_SCREEN_CONTENT.heading}</H3>
        <Muted className="text-center text-sm">
          {PLAY_SCREEN_CONTENT.description}
        </Muted>
      </View>

      <View className="gap-4">
        {PLAY_MODES.map((mode) => {
          const IconComponent = modeIcons[mode.icon];
          const styles = modeStyles[mode.tone];
          const isPending = pendingModeId === mode.id;

          return (
            <Card
              key={mode.id}
              className={cn(
                "gap-0 overflow-hidden rounded-4xl border-border/60 py-0",
                isPending && styles.halo,
              )}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={mode.title}
                className={cn("active:bg-card/80", isCreating && "opacity-70")}
                disabled={isCreating}
                onPress={() => handleSelectMode(mode)}
              >
                <CardContent className="min-h-20 flex-row items-center gap-4 px-4 py-4">
                  <View
                    className={cn(
                      "size-10 items-center justify-center rounded-xl",
                      styles.badge,
                    )}
                  >
                    <Icon
                      as={IconComponent}
                      className={cn("size-4", styles.badgeIcon)}
                    />
                  </View>
                  <View className="min-w-0 flex-1 items-center justify-center gap-1">
                    <H6 className="text-center text-sm font-semibold text-foreground">
                      {mode.title}
                    </H6>
                    <Muted className="mt-0 text-center text-xs">
                      {mode.description}
                    </Muted>
                  </View>
                  <View className="size-5 items-center justify-center">
                    {isPending ? (
                      <ActivityIndicator style={stylesheets.spinner} />
                    ) : (
                      <Icon
                        as={ChevronRight}
                        className="size-5 text-muted-foreground"
                      />
                    )}
                  </View>
                </CardContent>
              </Pressable>
            </Card>
          );
        })}
      </View>
    </View>
  );
};

const stylesheets = StyleSheet.create({
  spinner: {
    height: 20,
    width: 20,
  },
});
