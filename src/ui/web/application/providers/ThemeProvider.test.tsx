import type { ReactNode } from "react";

import { renderToString } from "react-dom/server";

import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";

import { setupColorSchemeMatchMedia } from "@/test/utils/matchMedia";

import { ThemeProvider, useTheme } from "./ThemeProvider";
import { UserPreferencesProvider } from "./UserPreferencesProvider";

const ThemeConsumer = () => {
  const { theme, resolvedTheme } = useTheme();

  return (
    <div
      data-testid="theme-values"
      data-theme={theme}
      data-resolved={resolvedTheme}
    />
  );
};

describe("ThemeProvider", () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <UserPreferencesProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </UserPreferencesProvider>
  );

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("uses system preference and applies the matching class", () => {
    setupColorSchemeMatchMedia(true);
    render(
      <UserPreferencesProvider>
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      </UserPreferencesProvider>,
    );

    const values = screen.getByTestId("theme-values");
    expect(values.dataset.theme).toBe("system");
    expect(values.dataset.resolved).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("updates theme, resolves it, and persists the preference", () => {
    setupColorSchemeMatchMedia(true);
    const { result } = renderHook(() => useTheme(), {
      wrapper,
    });

    act(() => {
      result.current.setTheme("light");
    });

    expect(result.current.theme).toBe("light");
    expect(result.current.resolvedTheme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("userPreferences")).toBe(
      JSON.stringify({
        theme: "light",
        gameSounds: true,
        haptics: true,
      }),
    );
  });

  it("uses a stored theme preference when available", () => {
    localStorage.setItem(
      "userPreferences",
      JSON.stringify({ theme: "dark", gameSounds: true, haptics: true }),
    );
    setupColorSchemeMatchMedia(false);

    const { result } = renderHook(() => useTheme(), {
      wrapper,
    });

    expect(result.current.theme).toBe("dark");
    expect(result.current.resolvedTheme).toBe("dark");
  });

  it("defaults to light when window is unavailable", () => {
    const originalWindow = window;
    vi.stubGlobal("window", undefined);

    try {
      const markup = renderToString(
        <UserPreferencesProvider>
          <ThemeProvider>
            <ThemeConsumer />
          </ThemeProvider>
        </UserPreferencesProvider>,
      );

      expect(markup).toContain('data-resolved="light"');
      expect(markup).toContain('data-theme="system"');
    } finally {
      vi.stubGlobal("window", originalWindow);
    }
  });

  it("responds to system theme changes while in system mode", async () => {
    const { setMatches } = setupColorSchemeMatchMedia(false);
    const { result } = renderHook(() => useTheme(), {
      wrapper,
    });

    expect(result.current.resolvedTheme).toBe("light");

    act(() => {
      setMatches(true);
    });

    await waitFor(() => {
      expect(result.current.resolvedTheme).toBe("dark");
    });
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("throws when useTheme is used outside the provider", () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      "useTheme must be used within ThemeProvider",
    );
  });
});
