import type { HomeStat } from "@/ui/shared/home/types/types";

export type HomeStatIconName = "flame" | "swords" | "trophy";

export const homeStatStyles: Record<
  HomeStat["accent"],
  {
    icon: HomeStatIconName;
    iconClassName: string;
    iconContainerClassName: string;
  }
> = {
  opponent: {
    icon: "swords",
    iconClassName: "text-opponent",
    iconContainerClassName: "bg-opponent/15",
  },
  primary: {
    icon: "trophy",
    iconClassName: "text-primary",
    iconContainerClassName: "bg-primary/15",
  },
  warning: {
    icon: "flame",
    iconClassName: "text-destructive",
    iconContainerClassName: "bg-destructive/15",
  },
};
