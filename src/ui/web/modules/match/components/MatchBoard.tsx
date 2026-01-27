import type { GameStatus } from "@/domain/entities/Game";
import { Card } from "@/ui/web/components/ui/card";
import { cn } from "@/ui/web/lib/utils";

type MatchBoardProps = {
  board: Array<"P1" | "P2" | null>;
  gridSize?: number;
  status: GameStatus;
  currentTurn: "P1" | "P2";
  currentUserId?: string;
  p1UserId: string;
  isPlacing?: boolean;
  onCellClick?: (index: number) => void;
  className?: string;
};

export const MatchBoard = ({
  board,
  gridSize,
  status,
  currentTurn,
  currentUserId,
  p1UserId,
  isPlacing,
  onCellClick,
  className,
}: MatchBoardProps) => {
  const resolvedGridSize = gridSize ?? 3;
  const currentSlot = resolveCurrentSlot(currentUserId, p1UserId);
  const isInteractive =
    status === "playing" &&
    Boolean(currentSlot) &&
    currentTurn === currentSlot &&
    !isPlacing;
  const isCurrentUserP1 = currentSlot ? currentSlot === "P1" : true;
  const playerColors = {
    P1: isCurrentUserP1 ? "text-primary" : "text-opponent",
    P2: isCurrentUserP1 ? "text-opponent" : "text-primary",
  };
  const displayBoard = toDisplayBoard(board, resolvedGridSize);
  return (
    <Card
      className={cn(
        "px-4 py-4 shadow-[0_14px_30px_-22px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[min(100vw,80vh)]">
        <div className="grid aspect-square grid-cols-3 gap-2 sm:gap-3">
          {displayBoard.flatMap((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const key = `${rowIndex}-${colIndex}`;
              const isDisabled = !isInteractive || cell !== "";
              const index = rowIndex * resolvedGridSize + colIndex;
              return (
                <button
                  type="button"
                  key={key}
                  disabled={isDisabled}
                  className={cn(
                    "grid aspect-square place-items-center rounded-2xl border border-border/70 bg-secondary text-[clamp(1.75rem,12vw,4.5rem)] font-semibold transition md:text-[clamp(2.5rem,8vw,5.5rem)] xl:text-9xl",
                    {
                      "cursor-pointer hover:border-primary/60 hover:bg-primary/10":
                        !isDisabled,
                      "cursor-not-allowed opacity-60": isDisabled,
                    },
                  )}
                  onClick={() => onCellClick?.(index)}
                >
                  <span
                    className={cn({
                      [playerColors.P1]: cell === "X",
                      [playerColors.P2]: cell === "O",
                    })}
                  >
                    {cell || ""}
                  </span>
                </button>
              );
            }),
          )}
        </div>
      </div>
    </Card>
  );
};

const toDisplayBoard = (board: Array<"P1" | "P2" | null>, gridSize: number) => {
  return Array.from({ length: gridSize }, (_, row) => {
    return board.slice(row * gridSize, (row + 1) * gridSize).map((cell) => {
      if (cell === "P1") {
        return "X";
      }
      if (cell === "P2") {
        return "O";
      }
      return "";
    });
  });
};

const resolveCurrentSlot = (
  currentUserId: string | undefined,
  p1UserId: string,
) => {
  if (!currentUserId) {
    return undefined;
  }

  return currentUserId === p1UserId ? "P1" : "P2";
};
