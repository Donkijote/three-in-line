import type { PropsWithChildren } from "react";

import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMobileHeader } from "@/ui/mobile/application/providers/MobileHeaderProvider";
import { useTheme } from "@/ui/mobile/application/providers/ThemeProvider";
import { Header } from "@/ui/mobile/components/Header";
import { ScrollArea } from "@/ui/mobile/components/ui/scroll-area";
import { NavBar } from "@/ui/mobile/layout/components/NavBar";
import { cn } from "@/ui/mobile/lib/utils";

export const AppLayout = ({ children }: PropsWithChildren) => {
  const { isDark } = useTheme();
  const { header } = useMobileHeader();

  return (
    <SafeAreaView
      className={cn("flex-1", {
        "bg-background": isDark,
        "bg-secondary": !isDark,
      })}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <View
        className={cn("flex-1", {
          "bg-background": isDark,
          "bg-secondary": !isDark,
        })}
      >
        {header ? (
          <View className="absolute inset-x-0 top-0 z-20">
            <Header {...header} />
          </View>
        ) : null}
        <ScrollArea
          contentContainerClassName={cn("min-h-full px-6 pb-24", {
            "pt-20": header,
            "pt-8": !header,
          })}
        >
          <View className="flex-1">{children}</View>
        </ScrollArea>
        <NavBar />
      </View>
    </SafeAreaView>
  );
};
