import { clsx } from "clsx";
import { useMemo } from "react";

import { GameState, type GameStateType } from "@/modules/board/types";

type BoardTitleProps = {
  isPlayerTurn: boolean;
  gameState: GameStateType;
};

export const BoardTitle = ({ isPlayerTurn, gameState }: BoardTitleProps) => {
  const text = useMemo(() => {
    if (gameState === GameState.PROGRESS) {
      return isPlayerTurn ? "Your Turn!" : "Bot’s Turn!";
    }
    if (gameState === GameState.WIN) {
      return "You Won!";
    }
    return "You Lost :(";
  }, [isPlayerTurn, gameState]);

  return (
    <div className={"flex flex-col gap-4 items-center"}>
      <h1
        className={clsx("text-4xl font-bold mb-1", {
          "text-primary drop-shadow-[0_0_6px_var(--glow-blue)]":
            (isPlayerTurn && gameState === GameState.PROGRESS) ||
            gameState === GameState.WIN,
          "text-secondary drop-shadow-[0_0_6px_var(--glow-red)]":
            (!isPlayerTurn && gameState === GameState.PROGRESS) ||
            gameState === GameState.LOST,
        })}
      >
        {text}
      </h1>
      <p className="text-sm text-text opacity-75">Name vs Bot's Name</p>
    </div>
  );
};
