import { useEffect } from "react";

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
import { Pressable, View } from "react-native";

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
import { playModeStyles } from "@/ui/shared/play/style/playModeStyles";

const modeIcons: Record<PlayMode["icon"], LucideIcon> = {
  hash: Hash,
  trophy: Trophy,
  medal: Medal,
  clock: Clock,
  "grid-4": Grid2x2,
  "grid-6": Grid3x3,
};

export const PlayScreen = () => {
  const { setHeader } = useMobileHeader();
  const { createGame, isCreating } = useCreateGame();

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
    const gameId = await createGame(mode.config);

    if (!gameId) {
      return;
    }

    router.push({
      pathname: "/match",
      params: { gameId },
    });
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
          const styles = playModeStyles[mode.tone].mobile;

          return (
            <Card
              key={mode.id}
              className="gap-0 overflow-hidden rounded-4xl border-border/60 py-0"
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={mode.title}
                className={cn(styles.pressHalo, isCreating && "opacity-70")}
                disabled={isCreating}
                onPress={() => handleSelectMode(mode)}
              >
                <CardContent className="min-h-20 flex-row items-center gap-4 px-4 py-4">
                  <View
                    className={cn(
                      "size-10 items-center justify-center rounded-xl",
                      styles.background,
                    )}
                  >
                    <Icon
                      as={IconComponent}
                      className={cn("size-4", styles.iconColor)}
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
                    <Icon
                      as={ChevronRight}
                      className="size-5 text-muted-foreground"
                    />
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
