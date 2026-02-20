import type { PropsWithChildren } from "react";

import { StatusBar } from "expo-status-bar";
import { useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScrollArea } from "@/ui/mobile/components/ui/scroll-area";
import { NavBar } from "@/ui/mobile/layout/components/NavBar";
import { cn } from "@/ui/mobile/lib/utils";

export const AppLayout = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

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
        <ScrollArea contentContainerClassName="min-h-full px-6 pb-24 pt-8">
          <View className="flex-1">{children}</View>
        </ScrollArea>
        <NavBar />
      </View>
    </SafeAreaView>
  );
};
