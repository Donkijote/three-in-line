import type { PropsWithChildren } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useMobileHeader } from "@/ui/mobile/application/providers/MobileHeaderProvider";
import { useTheme } from "@/ui/mobile/application/providers/ThemeProvider";
import { Header } from "@/ui/mobile/components/Header";
import { ScrollArea } from "@/ui/mobile/components/ui/scroll-area";
import { NavBar } from "@/ui/mobile/layout/components/NavBar";
import { cn } from "@/ui/mobile/lib/utils";

export const AppLayout = ({ children }: PropsWithChildren) => {
  const { isDark } = useTheme();
  const { header } = useMobileHeader();
  const insets = useSafeAreaInsets();
  const headerScrollOffset = header ? insets.top + 64 : insets.top + 16;
  const fadeOpaque = isDark
    ? "rgba(10, 10, 10, 0.92)"
    : "rgba(245, 245, 247, 0.92)";
  const fadeTransparent = isDark
    ? "rgba(10, 10, 10, 0)"
    : "rgba(245, 245, 247, 0)";
  const topFadeHeight = Math.max(insets.top + 56, 72);
  const bottomFadeHeight = Math.max(insets.bottom + 32, 44);

  return (
    <View
      className={cn("flex-1", {
        "bg-background": isDark,
        "bg-secondary": !isDark,
      })}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      {header ? (
        <View className="absolute inset-x-0 top-0 z-20">
          <Header {...header} />
        </View>
      ) : null}
      <SafeAreaView className="flex-1" edges={["left", "right"]}>
        <ScrollArea
          automaticallyAdjustContentInsets={false}
          contentInsetAdjustmentBehavior="never"
          contentContainerClassName="min-h-full px-6 pb-24"
          contentContainerStyle={{
            paddingBottom: insets.bottom + 96,
            paddingTop: headerScrollOffset,
          }}
        >
          <View className="flex-1">{children}</View>
        </ScrollArea>
        <NavBar />
      </SafeAreaView>
      <LinearGradient
        pointerEvents="none"
        colors={[fadeOpaque, fadeTransparent]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          height: topFadeHeight,
          left: 0,
          position: "absolute",
          right: 0,
          top: 0,
          zIndex: 30,
        }}
      />
      <LinearGradient
        pointerEvents="none"
        colors={[fadeTransparent, fadeOpaque]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          bottom: 0,
          height: bottomFadeHeight,
          left: 0,
          position: "absolute",
          right: 0,
          zIndex: 30,
        }}
      />
    </View>
  );
};
