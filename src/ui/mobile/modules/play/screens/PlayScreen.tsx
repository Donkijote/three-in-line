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
import { H3, H6, Muted, Small } from "@/ui/mobile/components/Typography";
import { Card, CardContent } from "@/ui/mobile/components/ui/card";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { cn } from "@/ui/mobile/lib/utils";
import { PLAY_MODES, type PlayMode } from "@/ui/shared/play/constants/modes";
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
    badge: "border-emerald-500/20 bg-emerald-500/10",
    badgeIcon: "text-emerald-500",
    halo: "bg-emerald-500/10",
  },
  yellow: {
    badge: "border-yellow-500/20 bg-yellow-500/10",
    badgeIcon: "text-yellow-500",
    halo: "bg-yellow-500/10",
  },
  fuchsia: {
    badge: "border-fuchsia-500/20 bg-fuchsia-500/10",
    badgeIcon: "text-fuchsia-500",
    halo: "bg-fuchsia-500/10",
  },
  orange: {
    badge: "border-orange-500/20 bg-orange-500/10",
    badgeIcon: "text-orange-500",
    halo: "bg-orange-500/10",
  },
  sky: {
    badge: "border-sky-500/20 bg-sky-500/10",
    badgeIcon: "text-sky-500",
    halo: "bg-sky-500/10",
  },
  violet: {
    badge: "border-violet-500/20 bg-violet-500/10",
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
      title: "Select Mode",
      eyebrow: "New Game",
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
      <View className="gap-4 pt-2">
        <Small
          variant="label"
          className="w-fit rounded-full border border-border/60 bg-card px-3 py-2 text-[10px] text-primary"
        >
          Fresh Match
        </Small>
        <View className="gap-2">
          <H3 className="text-left text-[32px] uppercase leading-[34px]">
            Choose{"\n"}your challenge
          </H3>
          <Muted className="text-base leading-6">
            Match the web catalog and jump into the mode that fits the pace,
            board, and stakes you want right now.
          </Muted>
        </View>
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
                "gap-0 overflow-hidden rounded-3xl border-border/60 py-0",
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
                <CardContent className="flex-row items-center gap-4 px-4 py-4">
                  <View
                    className={cn(
                      "size-14 items-center justify-center rounded-2xl border",
                      styles.badge,
                    )}
                  >
                    <Icon
                      as={IconComponent}
                      className={cn("size-6", styles.badgeIcon)}
                    />
                  </View>
                  <View className="min-w-0 flex-1 gap-1">
                    <H6 className="text-base text-foreground">{mode.title}</H6>
                    <Muted className="mt-0 text-sm leading-5">
                      {mode.description}
                    </Muted>
                  </View>
                  {isPending ? (
                    <ActivityIndicator style={stylesheets.spinner} />
                  ) : (
                    <Icon
                      as={ChevronRight}
                      className="size-5 text-muted-foreground"
                    />
                  )}
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
