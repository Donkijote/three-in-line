import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  loadThemePreference,
  saveThemePreference,
} from "@/ui/web/theme/storage";
import { isThemePreference, type ThemePreference } from "@/ui/web/theme/theme";

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
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
};

const getInitialTheme = (): ThemePreference => {
  const storedPreference = loadThemePreference();
  if (storedPreference && isThemePreference(storedPreference)) {
    return storedPreference;
  }

  return "system";
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<ThemePreference>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(getInitialTheme()),
  );

  useEffect(() => {
    const nextResolvedTheme = resolveTheme(theme);
    setResolvedTheme(nextResolvedTheme);
    applyThemeClass(nextResolvedTheme);
    saveThemePreference(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const nextResolvedTheme = resolveTheme("system");
      setResolvedTheme(nextResolvedTheme);
      applyThemeClass(nextResolvedTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme],
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
