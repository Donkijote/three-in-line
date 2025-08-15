import { GameState } from "../types";

export const WINNING_COMBOS = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal
  [2, 4, 6], // diagonal
];

export const DEFAULT_PLAYS = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];

export const checkWinner = (plays: Array<number | null>) => {
  let winner = null;
  for (const [a, b, c] of WINNING_COMBOS) {
    if (plays[a] !== null && plays[a] === plays[b] && plays[a] === plays[c]) {
      winner = plays[a];
      break;
    }
  }
  if (winner !== null && winner) return GameState.WIN;
  if (winner !== null && !winner) return GameState.LOST;
  if (!plays.includes(null) && winner === null) return GameState.TIED;
  return GameState.PROGRESS;
};
