import { clsx } from "clsx";

import { StorageKeys, StorageService } from "@/application/storage-service";
import { GameState, type GameStorageType } from "@/modules/board/types";
import type { UserSettings } from "@/types";

import { SidebarElement } from "./SidebarElement";

type SidebarProps = {
  isOpen: boolean;
};

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const matchesKey = StorageService.get(StorageKeys.GAMES);
  const userSettingsKey = StorageService.get(StorageKeys.USER_SETTINGS);

  const games = matchesKey
    ? (JSON.parse(matchesKey) as Array<GameStorageType>).filter(
        ({ state }) => state !== GameState.PROGRESS,
      )
    : [];
  const userSettings: UserSettings = userSettingsKey
    ? JSON.parse(userSettingsKey)
    : { name: "", bot: "", difficulty: "easy" };

  return (
    <div
      className={clsx(
        "fixed left-0 flex h-[calc(100dvh)] w-full max-w-[20rem] flex-col space-y-6 bg-sidebar-bg bg-clip-border p-4 text-sidebar-text shadow-xl shadow-gray-900/5 transition-transform",
        {
          "translate-x-0": isOpen,
          "-translate-x-full": !isOpen,
        },
      )}
      data-testid="sidebar"
    >
      <div className="mb-2 p-4">
        <h2 className="tracking-white block font-sans text-xl leading-snug font-bold text-text antialiased">
          Matches History
        </h2>
      </div>
      <nav className="flex min-w-[240px] flex-col gap-1 space-y-2 p-2 font-sans text-base font-normal">
        {games.map((game) => (
          <SidebarElement key={game.id} game={game} settings={userSettings} />
        ))}
      </nav>
    </div>
  );
};
