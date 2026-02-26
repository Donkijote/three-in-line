import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect } from "react";

import { useColorScheme } from "nativewind";

import type { ThemePreference } from "@/domain/entities/UserPreferences";
import { useUserPreferences } from "@/ui/mobile/application/providers/UserPreferencesProvider";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  isDark: boolean;
  mode: ThemeMode;
  setTheme: (theme: ThemePreference) => void;
  theme: ThemePreference;
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
  const { colorScheme, setColorScheme } = useColorScheme();
  const { preferences, updatePreferences } = useUserPreferences();
  const theme = preferences.theme;

  useEffect(() => {
    setColorScheme(theme);
  }, [setColorScheme, theme]);

  let mode: ThemeMode;
  if (theme === "light" || theme === "dark") {
    mode = theme;
  } else if (colorScheme === "dark") {
    mode = "dark";
  } else {
    mode = "light";
  }
  const isDark = mode === "dark";

  const setTheme = (nextTheme: ThemePreference) => {
    updatePreferences({ theme: nextTheme });
  };

  const toggleTheme = () => {
    setTheme(mode === "dark" ? "light" : "dark");
  };

  const value: ThemeContextValue = {
    isDark,
    mode,
    setTheme,
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
