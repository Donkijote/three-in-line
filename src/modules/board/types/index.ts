export const GameState = {
  WIN: "WIN",
  LOST: "LOST",
  TIED: "TIED",
  PROGRESS: "PROGRESS",
} as const;

export type GameStateType = keyof typeof GameState;

export type GameStorageType = {
  id: string;
  date: Date;
  plays: Array<number | null>;
  isPlayerTurn: boolean;
  state: GameStateType;
};
