import type { ReactNode } from "react";

import { BlurView } from "expo-blur";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { H6, Small } from "@/ui/mobile/components/Typography";
import { cn } from "@/ui/mobile/lib/utils";

type HeaderProps = {
  title: string;
  eyebrow?: string;
  leftSlot?: ReactNode;
};

export type { HeaderProps };

export const Header = ({ title, eyebrow, leftSlot }: HeaderProps) => {
  const isIOS = Platform.OS === "ios";
  const insets = useSafeAreaInsets();

  return (
    <View>
      <View className="overflow-hidden border-b border-border/60">
        {isIOS ? (
          <BlurView
            intensity={25}
            tint="default"
            className="absolute inset-0"
          />
        ) : (
          <View className="absolute inset-0 bg-card/80" />
        )}
        <View
          className="relative flex-row items-center justify-center px-4 pb-3"
          style={{ paddingTop: insets.top + 8 }}
        >
          {leftSlot ? (
            <View className="absolute left-4 z-10 flex-row items-center">
              {leftSlot}
            </View>
          ) : null}
          <View className="items-center">
            {eyebrow ? (
              <Small
                variant="label"
                className="text-[10px] tracking-[1.5px] text-primary/80"
              >
                {eyebrow}
              </Small>
            ) : null}
            <H6
              className={cn(
                "font-semibold uppercase tracking-[2px] leading-none",
                {
                  "text-[20px] text-foreground": eyebrow,
                  "text-[16px] text-muted-foreground": !eyebrow,
                },
              )}
            >
              {title}
            </H6>
          </View>
        </View>
      </View>
    </View>
  );
};
