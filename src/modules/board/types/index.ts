export const GameState = {
  WIN: "WIN",
  LOST: "LOST",
  TIED: "TIED",
  PROGRESS: "PROGRESS",
} as const;

export type GameStateType = keyof typeof GameState;
