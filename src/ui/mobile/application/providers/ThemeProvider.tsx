import type { PropsWithChildren } from "react";

import { useColorScheme, View } from "react-native";

import { cn } from "@/ui/mobile/lib/utils";

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className={cn("flex-1 bg-background", { dark: isDark })}>
      {children}
    </View>
  );
};
