import type { HomeMatchStatus } from "@/ui/shared/home/types/types";

type HomeMatchStatusStyle = {
  badge: string;
  rail: string;
  text: string;
  mobile: {
    emphasis: string;
  };
  web: {
    emphasis: string;
  };
};

export const homeMatchStatusStyles: Record<
  HomeMatchStatus,
  HomeMatchStatusStyle
> = {
  victory: {
    badge: "bg-primary/20 text-primary",
    rail: "bg-primary",
    text: "Victory",
    mobile: {
      emphasis: "border-primary/70",
    },
    web: {
      emphasis: "ring-primary/70",
    },
  },
  defeat: {
    badge: "bg-destructive/20 text-destructive",
    rail: "bg-destructive",
    text: "Defeat",
    mobile: {
      emphasis: "border-destructive/70",
    },
    web: {
      emphasis: "ring-destructive/70",
    },
  },
  stalemate: {
    badge: "bg-muted text-muted-foreground",
    rail: "bg-muted-foreground",
    text: "Stalemate",
    mobile: {
      emphasis: "border-border",
    },
    web: {
      emphasis: "ring-muted-foreground/60",
    },
  },
};
