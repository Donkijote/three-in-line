import { clsx } from "clsx";
import { useCallback, useMemo, useState } from "react";

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

const GameState = {
  WIN: "win",
  LOST: "lost",
  TIED: "tied",
  PROGRESS: "progress",
};

export const Board = () => {
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [plays, setPlays] = useState<Array<number | null>>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const gameState = useMemo(() => {
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

  const isGameInProgress = gameState === GameState.PROGRESS;

  return (
    <div className="flex h-[calc(100dvh-8rem)] w-full justify-start flex-col gap-12">
      <div className={"flex flex-col gap-4 items-center"}>
        <h1
          className={clsx("text-4xl font-bold mb-1", {
            "text-primary drop-shadow-[0_0_6px_var(--glow-blue)]": isPlayerTurn,
            "text-secondary drop-shadow-[0_0_6px_var(--glow-red)]":
              !isPlayerTurn,
          })}
        >
          {isPlayerTurn ? "Your Turn!" : "Bot’s Turn!"}
        </h1>
        <p className="text-sm text-text opacity-75">Name vs Bot's Name</p>
      </div>
      <div
        className={
          "xs:max-md:px-0 md:max-lg:px-32 lg:max-xl:px-60 xl:max-2xl:px-90 2xl:px-96"
        }
      >
        <div
          className={
            "grid grid-flow-row grid-cols-3 h-[calc(100dvh-18rem)] max-h-[812px] max-w-[1200px] m-auto"
          }
        >
          {plays.map((item, index) => (
            <button
              key={`${index}-${item}`}
              className={clsx(
                "flex bg-background border-t-0 border-r-0 justify-center border border-grid items-center aspect-square transition-all duration-150 ",
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
    </div>
  );
};
