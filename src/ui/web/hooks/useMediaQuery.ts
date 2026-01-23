import { useEffectEvent, useLayoutEffect, useState } from "react";

type Breakpoint = "mobile" | "sm" | "md" | "lg" | "xl" | "2xl";

const queries: Record<Breakpoint, string> = {
  mobile: "(max-width: 767px)",
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
};

export function useMediaQuery() {
  const getCurrentBreakpoint = (): Breakpoint => {
    if (typeof window === "undefined") return "mobile";

    if (window.matchMedia(queries["2xl"]).matches) return "2xl";
    if (window.matchMedia(queries.xl).matches) return "xl";
    if (window.matchMedia(queries.lg).matches) return "lg";
    if (window.matchMedia(queries.md).matches) return "md";
    if (window.matchMedia(queries.sm).matches) return "sm";

    return "mobile";
  };

  const [breakpoint, setBreakpoint] =
    useState<Breakpoint>(getCurrentBreakpoint);

  const syncMedia = useEffectEvent(() => setBreakpoint(getCurrentBreakpoint()));

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQueries = Object.values(queries).map((query) =>
      window.matchMedia(query),
    );

    const listener = () => {
      syncMedia();
    };

    mediaQueries.forEach((mq) => {
      mq.addEventListener("change", listener);
    });

    return () => {
      mediaQueries.forEach((mq) => {
        mq.removeEventListener("change", listener);
      });
    };
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === "mobile",
    isTablet: breakpoint === "md",
    isDesktop: ["lg", "xl", "2xl"].includes(breakpoint),
  };
}
