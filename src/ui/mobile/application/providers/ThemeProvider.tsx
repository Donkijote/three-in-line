import type { PropsWithChildren } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { useColorScheme } from "nativewind";
import { View } from "react-native";

import { cn } from "@/ui/mobile/lib/utils";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  isDark: boolean;
  mode: ThemeMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [fallbackMode, setFallbackMode] = useState<ThemeMode>("light");
  const mode: ThemeMode =
    colorScheme === "dark" || colorScheme === "light"
      ? colorScheme
      : fallbackMode;
  const isDark = mode === "dark";

  const toggleTheme = useCallback(() => {
    toggleColorScheme();
    setFallbackMode((current) => (current === "dark" ? "light" : "dark"));
  }, [toggleColorScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      isDark,
      mode,
      toggleTheme,
    }),
    [isDark, mode, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View className={cn("flex-1")}>{children}</View>
    </ThemeContext.Provider>
  );
};
