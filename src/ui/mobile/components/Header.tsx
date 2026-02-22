import type { ReactNode } from "react";

import { BlurView } from "expo-blur";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/ui/mobile/components/ui/text";
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
              <Text className="text-[10px] font-semibold uppercase tracking-[1.5px] text-primary/80">
                {eyebrow}
              </Text>
            ) : null}
            <Text
              className={cn(
                "font-semibold uppercase tracking-[2px] leading-none",
                {
                  "text-[20px] text-foreground": eyebrow,
                  "text-[16px] text-muted-foreground": !eyebrow,
                },
              )}
            >
              {title}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
