import {
  createContext,
  type PropsWithChildren,
  useCallback,
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
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const isDark = root.classList.contains("dark");

  if (resolvedTheme === "dark" && !isDark) root.classList.add("dark");
  if (resolvedTheme === "light" && isDark) root.classList.remove("dark");
};

const getInitialTheme = (): ThemePreference => {
  const storedPreference = loadThemePreference();
  if (storedPreference && isThemePreference(storedPreference)) {
    return storedPreference;
  }

  return "system";
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [{ theme, resolvedTheme }, setState] = useState(() => {
    const initialTheme = getInitialTheme();
    const initialResolved = resolveTheme(initialTheme);
    applyThemeClass(initialResolved);

    return { theme: initialTheme, resolvedTheme: initialResolved };
  });

  const setTheme = useCallback((nextTheme: ThemePreference) => {
    setState(() => {
      const nextResolved = resolveTheme(nextTheme);
      applyThemeClass(nextResolved);
      saveThemePreference(nextTheme);
      return { theme: nextTheme, resolvedTheme: nextResolved };
    });
  }, []);

  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const nextResolved = resolveTheme("system");
      setState((prev) => {
        applyThemeClass(nextResolved);
        return { ...prev, resolvedTheme: nextResolved };
      });
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
