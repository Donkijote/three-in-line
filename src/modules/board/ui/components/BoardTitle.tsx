import { clsx } from "clsx";
import { useMemo } from "react";

import { StorageKeys, StorageService } from "@/application/storage-service";
import { GameState, type GameStateType } from "@/modules/board/types";
import type { UserSettings } from "@/types";

type BoardTitleProps = {
  isPlayerTurn: boolean;
  gameState: GameStateType;
};

export const BoardTitle = ({ isPlayerTurn, gameState }: BoardTitleProps) => {
  const userConfigKey = StorageService.get(StorageKeys.USER_SETTINGS);
  let botName = "Bot";
  let userName = "Player";
  if (userConfigKey) {
    const userSettings = JSON.parse(userConfigKey) as UserSettings;
    userName = userSettings.name;
    botName = userSettings.bot;
  }

  const text = useMemo(() => {
    if (gameState === GameState.PROGRESS) {
      return isPlayerTurn ? `${userName} Turn!` : `${botName} Turn!`;
    }
    if (gameState === GameState.WIN) {
      return "You Won!";
    }
    if (gameState === GameState.LOST) {
      return "You Lost :(";
    }
    return "It's a Tied!";
  }, [isPlayerTurn, gameState, userName, botName]);

  return (
    <div
      className={"flex flex-col items-center gap-4"}
      data-testid={"BoardTitle"}
    >
      <h1
        className={clsx("mb-1 text-4xl font-bold", {
          "text-primary drop-shadow-[0_0_6px_var(--glow-blue)]":
            (isPlayerTurn && gameState === GameState.PROGRESS) ||
            gameState === GameState.WIN,
          "text-secondary drop-shadow-[0_0_6px_var(--glow-red)]":
            (!isPlayerTurn && gameState === GameState.PROGRESS) ||
            gameState === GameState.LOST,
          "text-amber-500 drop-shadow-[0_0_6px_var(--glow-blue)]":
            gameState === GameState.TIED,
        })}
        data-testid={"BoardTitle-title"}
      >
        {text}
      </h1>
      <p className="text-sm text-text opacity-75">
        {userName} vs {botName}
      </p>
    </div>
  );
};
