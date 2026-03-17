import type { GameConfig } from "@/domain/entities/GameConfig";

type PlayModeIcon = "hash" | "trophy" | "medal" | "clock" | "grid-4" | "grid-6";
type PlayModeTone =
  | "emerald"
  | "yellow"
  | "fuchsia"
  | "orange"
  | "sky"
  | "violet";

type PlayMode = {
  id: string;
  title: string;
  description: string;
  icon: PlayModeIcon;
  tone: PlayModeTone;
  config: GameConfig;
};

const PLAY_MODES: readonly PlayMode[] = [
  {
    id: "classic",
    title: "Classic Mode",
    description: "Standard rules. The original game.",
    icon: "hash",
    tone: "emerald",
    config: { gridSize: 3, winLength: 3, matchFormat: "single" },
  },
  {
    id: "best-of-three",
    title: "Best of Three",
    description: "First to 2 wins takes the crown.",
    icon: "trophy",
    tone: "yellow",
    config: { gridSize: 3, winLength: 3, matchFormat: "bo3" },
  },
  {
    id: "best-of-five",
    title: "Best of Five",
    description: "An extended battle for dominance.",
    icon: "medal",
    tone: "fuchsia",
    config: { gridSize: 3, winLength: 3, matchFormat: "bo5" },
  },
  {
    id: "time-challenge",
    title: "Time Challenge",
    description: "Make your move before time runs out.",
    icon: "clock",
    tone: "orange",
    config: {
      gridSize: 3,
      winLength: 3,
      matchFormat: "single",
      isTimed: true,
    },
  },
  {
    id: "grid-4x4",
    title: "4x4 Grid",
    description: "Connect 4 to win on a bigger board.",
    icon: "grid-4",
    tone: "sky",
    config: { gridSize: 4, winLength: 3, matchFormat: "single" },
  },
  {
    id: "grid-6x6",
    title: "6x6 Grid",
    description: "Complex strategy on a massive field.",
    icon: "grid-6",
    tone: "violet",
    config: { gridSize: 6, winLength: 3, matchFormat: "single" },
  },
] as const;

export type { PlayMode, PlayModeIcon, PlayModeTone };
export { PLAY_MODES };
