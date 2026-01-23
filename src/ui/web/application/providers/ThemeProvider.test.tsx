import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { vi } from "vitest";

import { ThemeProvider, useTheme } from "./ThemeProvider";

type MatchMediaController = {
  setMatches: (matches: boolean) => void;
};

const setupMatchMedia = (initialMatches: boolean): MatchMediaController => {
  let matches = initialMatches;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  const mql = {
    media: "(prefers-color-scheme: dark)",
    matches,
    onchange: null,
    addEventListener: (
      type: string,
      listener: (event: MediaQueryListEvent) => void,
    ) => {
      if (type === "change") listeners.add(listener);
    },
    removeEventListener: (
      type: string,
      listener: (event: MediaQueryListEvent) => void,
    ) => {
      if (type === "change") listeners.delete(listener);
    },
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  } as MediaQueryList;

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: () => mql,
  });

  return {
    setMatches: (nextMatches) => {
      matches = nextMatches;
      // @ts-expect-error: override for test
      mql.matches = nextMatches;
      const event = {
        matches: nextMatches,
        media: mql.media,
      } as MediaQueryListEvent;
      listeners.forEach((listener) => {
        listener(event);
      });
    },
  };
};

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
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("uses system preference and applies the matching class", () => {
    setupMatchMedia(true);
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    const values = screen.getByTestId("theme-values");
    expect(values.dataset.theme).toBe("system");
    expect(values.dataset.resolved).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("updates theme, resolves it, and persists the preference", () => {
    setupMatchMedia(true);
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    act(() => {
      result.current.setTheme("light");
    });

    expect(result.current.theme).toBe("light");
    expect(result.current.resolvedTheme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe(JSON.stringify("light"));
  });

  it("uses a stored theme preference when available", () => {
    localStorage.setItem("theme", JSON.stringify("dark"));
    setupMatchMedia(false);

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    expect(result.current.theme).toBe("dark");
    expect(result.current.resolvedTheme).toBe("dark");
  });

  it("defaults to light when window is unavailable", () => {
    const originalWindow = window;
    vi.stubGlobal("window", undefined);

    try {
      const markup = renderToString(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>,
      );

      expect(markup).toContain('data-resolved="light"');
      expect(markup).toContain('data-theme="system"');
    } finally {
      vi.stubGlobal("window", originalWindow);
    }
  });

  it("responds to system theme changes while in system mode", async () => {
    const { setMatches } = setupMatchMedia(false);
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
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
