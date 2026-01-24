import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ThemePreference } from "@/domain/entities/UserPreferences";
import { useUserPreferences } from "@/ui/web/application/providers/UserPreferencesProvider";

type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const resolveTheme = (theme: ThemePreference): ResolvedTheme =>
  theme === "system" ? getSystemTheme() : theme;

const applyThemeClass = (resolvedTheme: ResolvedTheme) => {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const isDark = root.classList.contains("dark");

  if (resolvedTheme === "dark" && !isDark) root.classList.add("dark");
  if (resolvedTheme === "light" && isDark) root.classList.remove("dark");
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const { preferences, updatePreferences } = useUserPreferences();
  const theme = preferences.theme;

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    const initialResolved = resolveTheme(theme);
    applyThemeClass(initialResolved);
    return initialResolved;
  });

  useEffect(() => {
    const nextResolved = resolveTheme(theme);
    setResolvedTheme(nextResolved);
    applyThemeClass(nextResolved);
  }, [theme]);

  const setTheme = useCallback(
    (nextTheme: ThemePreference) => {
      updatePreferences({ theme: nextTheme });
    },
    [updatePreferences],
  );

  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const nextResolved = resolveTheme("system");
      setResolvedTheme(nextResolved);
      applyThemeClass(nextResolved);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
};
