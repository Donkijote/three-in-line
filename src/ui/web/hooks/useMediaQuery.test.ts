import { act, renderHook } from "@testing-library/react";

import { useMediaQuery } from "./useMediaQuery";

type MatchMediaController = {
  setWidth: (width: number) => void;
};

const setupMatchMedia = (initialWidth: number): MatchMediaController => {
  let width = initialWidth;
  const mqls = new Map<
    MediaQueryList,
    Set<(event: MediaQueryListEvent) => void>
  >();

  const getQueryMatch = (query: string) => {
    const maxMatch = query.match(/max-width:\s*(\d+)px/);
    if (maxMatch) {
      return width <= Number(maxMatch[1]);
    }

    const minMatch = query.match(/min-width:\s*(\d+)px/);
    if (minMatch) {
      return width >= Number(minMatch[1]);
    }

    return false;
  };

  const matchMedia = (query: string): MediaQueryList => {
    const mql = {
      media: query,
      matches: getQueryMatch(query),
      onchange: null,
      addEventListener: (
        type: string,
        listener: (event: MediaQueryListEvent) => void,
      ) => {
        if (type !== "change") return;
        const listeners = mqls.get(mql as MediaQueryList) ?? new Set();
        listeners.add(listener);
        mqls.set(mql as MediaQueryList, listeners);
      },
      removeEventListener: (
        type: string,
        listener: (event: MediaQueryListEvent) => void,
      ) => {
        if (type !== "change") return;
        const listeners = mqls.get(mql as MediaQueryList);
        listeners?.delete(listener);
      },
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    } as MediaQueryList;

    return mql;
  };

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: matchMedia,
  });

  return {
    setWidth: (nextWidth) => {
      width = nextWidth;
      for (const [mql, listeners] of mqls.entries()) {
        const nextMatch = getQueryMatch(mql.media);
        if (nextMatch === mql.matches) continue;
        const event = {
          matches: nextMatch,
          media: mql.media,
        } as MediaQueryListEvent;
        listeners.forEach((listener) => {
          listener(event);
        });
      }
    },
  };
};

describe("useMediaQuery", () => {
  it("returns mobile for small viewports", () => {
    setupMatchMedia(480);
    const { result } = renderHook(() => useMediaQuery());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.breakpoint).toBe("mobile");
  });

  it("returns desktop for large viewports", () => {
    setupMatchMedia(1200);
    const { result } = renderHook(() => useMediaQuery());

    expect(result.current.isDesktop).toBe(true);
    expect(result.current.breakpoint).toBe("lg");
  });

  it("updates breakpoint on viewport changes", () => {
    const { setWidth } = setupMatchMedia(500);
    const { result } = renderHook(() => useMediaQuery());

    expect(result.current.isMobile).toBe(true);

    act(() => {
      setWidth(800);
    });

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.breakpoint).toBe("md");
  });
});
