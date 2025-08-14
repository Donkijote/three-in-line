import { clsx } from "clsx";

const arr = Array.from({ length: 9 }, (_, i) => i % 2);

export const Board = () => {
  const isPlayerTurn = true; // This would typically come from a state or prop

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
          {arr.map((item, index) => (
            <button
              key={`${index}-${item}`}
              className={clsx(
                "flex bg-background border-t-0 border-r-0 justify-center border border-grid items-center cursor-pointer aspect-square transition-all duration-150 hover:bg-white/5",
                {
                  "border-b-0": index >= 6,
                  "border-l-0": index % 3 === 0,
                },
              )}
            >
              <span
                className={clsx(
                  "material-symbols-rounded !text-7xl md:max-xl:!text-8xl xl:max-2xl:!text-8xl 2xl:!text-9xl",
                  {
                    "text-primary drop-shadow-[0_0_6px_var(--glow-blue)]": item,
                    "text-secondary drop-shadow-[0_0_6px_var(--glow-red)]":
                      !item,
                  },
                )}
              >
                {item ? "close" : "radio_button_unchecked"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
