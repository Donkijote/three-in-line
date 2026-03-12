import { createElement } from "react";

import { renderToString } from "react-dom/server";

import { act, renderHook } from "@testing-library/react";

import { setupResponsiveMatchMedia } from "@/test/utils/matchMedia";

import { useMediaQuery } from "./useMediaQuery";

describe("useMediaQuery", () => {
  it("returns sm for medium-small viewports", () => {
    setupResponsiveMatchMedia(700);
    const { result } = renderHook(() => useMediaQuery());

    expect(result.current.breakpoint).toBe("sm");
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it("returns mobile for small viewports", () => {
    setupResponsiveMatchMedia(480);
    const { result } = renderHook(() => useMediaQuery());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.breakpoint).toBe("mobile");
  });

  it("returns desktop for large viewports", () => {
    setupResponsiveMatchMedia(1200);
    const { result } = renderHook(() => useMediaQuery());

    expect(result.current.isDesktop).toBe(true);
    expect(result.current.breakpoint).toBe("lg");
  });

  it("returns xl and 2xl for extra-wide viewports", () => {
    const { setWidth } = setupResponsiveMatchMedia(1400);
    const { result } = renderHook(() => useMediaQuery());

    expect(result.current.breakpoint).toBe("xl");
    expect(result.current.isDesktop).toBe(true);

    act(() => {
      setWidth(1600);
    });

    expect(result.current.breakpoint).toBe("2xl");
    expect(result.current.isDesktop).toBe(true);
  });

  it("updates breakpoint on viewport changes", () => {
    const { setWidth } = setupResponsiveMatchMedia(500);
    const { result } = renderHook(() => useMediaQuery());

    expect(result.current.isMobile).toBe(true);

    act(() => {
      setWidth(800);
    });

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.breakpoint).toBe("md");
  });

  it("falls back to mobile when window is unavailable", () => {
    const originalWindow = window;
    vi.stubGlobal("window", undefined);

    try {
      const markup = renderToString(createElement(ServerConsumer));

      expect(markup).toContain('data-breakpoint="mobile"');
      expect(markup).toContain('data-mobile="true"');
    } finally {
      vi.stubGlobal("window", originalWindow);
    }
  });

  it("removes listeners on unmount", () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) =>
        ({
          media: query,
          matches: false,
          onchange: null,
          addEventListener,
          removeEventListener,
          addListener: () => undefined,
          removeListener: () => undefined,
          dispatchEvent: () => false,
        }) as MediaQueryList,
    });

    const { unmount } = renderHook(() => useMediaQuery());

    expect(addEventListener).toHaveBeenCalledTimes(6);

    unmount();

    expect(removeEventListener).toHaveBeenCalledTimes(6);
  });
});

const ServerConsumer = () => {
  const { breakpoint, isMobile } = useMediaQuery();

  return createElement("div", {
    "data-breakpoint": breakpoint,
    "data-mobile": String(isMobile),
  });
};
