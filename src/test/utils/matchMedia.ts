type MediaQueryListener = (
  this: MediaQueryList,
  event: MediaQueryListEvent,
) => void;

class MockMediaQueryList implements MediaQueryList {
  private currentMatches: boolean;
  private readonly changeListeners =
    new Set<EventListenerOrEventListenerObject>();
  public readonly media: string;

  public onchange:
    | ((this: MediaQueryList, ev: MediaQueryListEvent) => unknown)
    | null = null;

  public constructor(media: string, initialMatches: boolean) {
    this.media = media;
    this.currentMatches = initialMatches;
  }

  public get matches() {
    return this.currentMatches;
  }

  public setMatches(nextMatches: boolean) {
    if (this.currentMatches === nextMatches) {
      return;
    }

    this.currentMatches = nextMatches;
    const event = Object.defineProperties(new Event("change"), {
      matches: {
        enumerable: true,
        value: nextMatches,
      },
      media: {
        enumerable: true,
        value: this.media,
      },
    }) as MediaQueryListEvent;

    this.onchange?.call(this, event);
    this.changeListeners.forEach((listener) => {
      if (typeof listener === "function") {
        listener.call(this, event);
        return;
      }

      listener.handleEvent(event);
    });
  }

  public addListener(listener: MediaQueryListener | null) {
    if (!listener) {
      return;
    }

    this.changeListeners.add(listener as EventListener);
  }

  public removeListener(listener: MediaQueryListener | null) {
    if (!listener) {
      return;
    }

    this.changeListeners.delete(listener as EventListener);
  }

  public addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    _options?: boolean | AddEventListenerOptions,
  ) {
    if (type !== "change" || !listener) {
      return;
    }

    this.changeListeners.add(listener);
  }

  public removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    _options?: boolean | EventListenerOptions,
  ) {
    if (type !== "change" || !listener) {
      return;
    }

    this.changeListeners.delete(listener);
  }

  public dispatchEvent(event: Event) {
    if (event.type !== "change") {
      return true;
    }

    this.changeListeners.forEach((listener) => {
      if (typeof listener === "function") {
        listener.call(this, event);
        return;
      }

      listener.handleEvent(event);
    });

    return true;
  }
}

type MatchMediaController = {
  registry: Map<string, MockMediaQueryList>;
};

const installMatchMedia = (
  getQueryMatch: (query: string) => boolean,
): MatchMediaController => {
  const registry = new Map<string, MockMediaQueryList>();

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string): MediaQueryList => {
      const existing = registry.get(query);
      if (existing) {
        existing.setMatches(getQueryMatch(query));
        return existing;
      }

      const nextQuery = new MockMediaQueryList(query, getQueryMatch(query));
      registry.set(query, nextQuery);
      return nextQuery;
    },
  });

  return { registry };
};

export const setupResponsiveMatchMedia = (initialWidth: number) => {
  let width = initialWidth;
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
  const { registry } = installMatchMedia(getQueryMatch);

  return {
    setWidth: (nextWidth: number) => {
      width = nextWidth;

      for (const mediaQuery of registry.values()) {
        mediaQuery.setMatches(getQueryMatch(mediaQuery.media));
      }
    },
  };
};

export const setupColorSchemeMatchMedia = (initialMatches: boolean) => {
  let matches = initialMatches;
  const { registry } = installMatchMedia(() => matches);
  const query = "(prefers-color-scheme: dark)";

  return {
    setMatches: (nextMatches: boolean) => {
      matches = nextMatches;
      registry.get(query)?.setMatches(nextMatches);
    },
  };
};
