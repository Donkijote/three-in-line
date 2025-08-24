import { clsx } from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  checkWinner,
  DEFAULT_PLAYS,
  syncGamePlay,
  syncGamesData,
} from "../domain/board-logic";
import type { GameStateType } from "../types";
import { GameState } from "../types";
import { BoardTitle } from "./components/BoardTitle";
import { NewGameButton } from "./components/NewGameButton";

export const Board = () => {
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [plays, setPlays] = useState<Array<number | null>>(DEFAULT_PLAYS);

  const gameState: GameStateType = useMemo(() => checkWinner(plays), [plays]);

  const handleAction: (position: number) => void = useCallback(
    (position: number) => {
      if (plays[position] !== null) return;

      setPlays((prevState) => {
        const newValues = [...prevState];
        newValues[position] = isPlayerTurn ? 1 : 0;
        syncGamePlay(newValues, isPlayerTurn, checkWinner(newValues));
        return newValues;
      });
      setIsPlayerTurn((prevState) => !prevState);
    },
    [isPlayerTurn, plays],
  );

  const handleRest: () => void = useCallback(() => {
    const result = syncGamesData();
    setPlays(result.plays);
    setIsPlayerTurn(result.isPlayerTurn);
  }, []);

  const handleBotAction: () => void = useCallback(() => {
    const availableIndexes = plays.reduce<Array<number>>(
      (acc, currentValue, currentIndex) => {
        if (currentValue === null) {
          acc.push(currentIndex);
        }
        return acc;
      },
      [],
    );
    const randomIndex = Math.floor(Math.random() * availableIndexes.length);
    setTimeout(() => handleAction(availableIndexes[randomIndex]), 1500);
  }, [plays, handleAction]);

  useEffect(() => {
    handleRest();
  }, [handleRest]);

  useEffect(() => {
    if (isPlayerTurn || gameState !== GameState.PROGRESS) return;
    handleBotAction();
  }, [isPlayerTurn, gameState, plays, handleBotAction]);

  const isGameInProgress = gameState === GameState.PROGRESS;

  return (
    <div
      className="flex h-[calc(100dvh-8rem)] w-full flex-col justify-start gap-12"
      data-testid={"Board"}
    >
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
                  "cursor-pointer hover:bg-white/5":
                    isGameInProgress && isPlayerTurn,
                },
              )}
              onClick={() => handleAction(index)}
              disabled={!isGameInProgress || !isPlayerTurn}
              data-testid={`Board-cell-${index}`}
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
      <NewGameButton gameState={gameState} handleRest={handleRest} />
    </div>
  );
};
