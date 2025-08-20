import { GameState, type GameStateType } from "@/modules/board/types";

type NewGameButtonProps = {
  gameState: GameStateType;
  handleRest: () => void;
};

export const NewGameButton = ({
  handleRest,
  gameState,
}: NewGameButtonProps) => {
  if (gameState === GameState.PROGRESS) return null;

  return (
    <button
      className={
        "mt-4 max-w-[300px] cursor-pointer self-center rounded-full bg-emerald-500 px-6 py-4 text-3xl font-semibold text-white shadow-md drop-shadow-[0_0_6px_rgba(16,185,129,0.5)] transition-all duration-200 hover:bg-emerald-600 hover:shadow-lg dark:hover:bg-emerald-400"
      }
      onClick={handleRest}
    >
      🔄 New Game
    </button>
  );
};
