import { clsx } from "clsx";

import { GameState, type GameStorageType } from "@/modules/board/types";
import type { UserSettings } from "@/types";

type HistoryElementProps = {
  game: GameStorageType;
  settings: UserSettings;
};

export const SidebarElement = ({ game, settings }: HistoryElementProps) => {
  let icon = "check";

  if (game.state === GameState.LOST) {
    icon = "close";
  }
  if (game.state === GameState.TIED) {
    icon = "remove";
  }

  return (
    <button className="flex w-full cursor-pointer items-center rounded-lg p-3 text-start leading-tight text-text transition-all outline-none hover:bg-hover">
      <div className="mr-4 grid place-items-center">
        <span
          className={clsx("material-symbols-outlined", {
            "text-primary": game.state === GameState.WIN,
            "text-secondary": game.state === GameState.LOST,
            "text-amber-500": game.state === GameState.TIED,
          })}
        >
          {icon}
        </span>
      </div>
      <p
        className={clsx({
          "text-primary": game.state === GameState.WIN,
          "text-secondary": game.state === GameState.LOST,
          "text-amber-500": game.state === GameState.TIED,
        })}
      >
        {settings.name} vs {settings.bot}
      </p>
    </button>
  );
};
