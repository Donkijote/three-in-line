import { clsx } from "clsx";
import { useCallback, useMemo, useState } from "react";

import type { GameStateType } from "../types";
import { GameState } from "../types";
import { BoardTitle } from "./components/BoardTitle";

const winningCombos = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal
  [2, 4, 6], // diagonal
];

const defaultPlays = [null, null, null, null, null, null, null, null, null];

export const Board = () => {
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [plays, setPlays] = useState<Array<number | null>>(defaultPlays);

  const gameState: GameStateType = useMemo(() => {
    let winner = null;
    for (const [a, b, c] of winningCombos) {
      if (plays[a] !== null && plays[a] === plays[b] && plays[a] === plays[c]) {
        winner = plays[a];
        break;
      }
    }
    if (winner !== null && winner) return GameState.WIN;
    if (winner !== null && !winner) return GameState.LOST;
    if (!plays.includes(null) && winner === null) return GameState.TIED;
    return GameState.PROGRESS;
  }, [plays]);

  const handleAction: (position: number) => void = useCallback(
    (position: number) => {
      if (plays[position] !== null) return;

      setPlays((prevState) => {
        const newValues = [...prevState];
        newValues[position] = isPlayerTurn ? 1 : 0;
        return newValues;
      });
      setIsPlayerTurn((prevState) => !prevState);
    },
    [isPlayerTurn, plays, setIsPlayerTurn],
  );

  const handleRest: () => void = useCallback(() => {
    setPlays(defaultPlays);
    setIsPlayerTurn(true);
  }, []);

  const isGameInProgress = gameState === GameState.PROGRESS;

  return (
    <div className="flex h-[calc(100dvh-8rem)] w-full flex-col justify-start gap-12">
      <BoardTitle isPlayerTurn={isPlayerTurn} gameState={gameState} />
      <div
        className={
          "xs:max-md:px-0 md:max-lg:px-32 lg:max-xl:px-60 xl:max-2xl:px-90 2xl:px-96"
        }
      >
        <div
          className={
            "m-auto grid h-[calc(100dvh-18rem)] max-h-[812px] max-w-[1200px] grid-flow-row grid-cols-3"
          }
        >
          {plays.map((item, index) => (
            <button
              key={`${index}-${item}`}
              className={clsx(
                "flex aspect-square items-center justify-center border border-t-0 border-r-0 border-grid bg-background transition-all duration-150",
                {
                  "border-b-0": index >= 6,
                  "border-l-0": index % 3 === 0,
                  "cursor-pointer hover:bg-white/5": isGameInProgress,
                },
              )}
              onClick={() => handleAction(index)}
              disabled={!isGameInProgress}
            >
              {item !== null && (
                <span
                  className={clsx(
                    "material-symbols-rounded !text-7xl md:max-xl:!text-8xl xl:max-2xl:!text-8xl 2xl:!text-9xl",
                    {
                      "text-primary drop-shadow-[0_0_6px_var(--glow-blue)]":
                        item,
                      "text-secondary drop-shadow-[0_0_6px_var(--glow-red)]":
                        !item,
                    },
                  )}
                >
                  {item ? "close" : "radio_button_unchecked"}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {gameState !== GameState.PROGRESS && (
        <button
          className={
            "mt-4 max-w-[300px] cursor-pointer self-center rounded-full bg-emerald-500 px-6 py-4 text-3xl font-semibold text-white shadow-md drop-shadow-[0_0_6px_rgba(16,185,129,0.5)] transition-all duration-200 hover:bg-emerald-600 hover:shadow-lg dark:hover:bg-emerald-400"
          }
          onClick={handleRest}
        >
          🔄 New Game
        </button>
      )}
    </div>
  );
};
