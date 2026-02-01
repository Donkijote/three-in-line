import { Activity } from "react";

import { TimerOff } from "lucide-react";

import { DEFAULT_GRID_SIZE, type GameStatus } from "@/domain/entities/Game";
import { Card } from "@/ui/web/components/ui/card";
import { useTurnTimer } from "@/ui/web/hooks/useGame";
import { cn } from "@/ui/web/lib/utils";

type MatchBoardProps = {
  board: Array<"P1" | "P2" | null>;
  gridSize?: number;
  status: GameStatus;
  currentTurn: "P1" | "P2";
  currentUserId?: string;
  p1UserId: string;
  turnDurationMs?: number | null;
  turnDeadlineTime?: number | null;
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
  turnDurationMs,
  turnDeadlineTime,
  isPlacing,
  onCellClick,
  className,
}: MatchBoardProps) => {
  const resolvedGridSize = gridSize ?? DEFAULT_GRID_SIZE;
  const currentSlot = resolveCurrentSlot(currentUserId, p1UserId);
  const timerEnabled = turnDurationMs !== null && turnDurationMs !== undefined;
  const timerActive =
    timerEnabled &&
    status === "playing" &&
    currentSlot === currentTurn &&
    turnDeadlineTime !== null &&
    turnDeadlineTime !== undefined;
  const { isExpired: isTimeUp } = useTurnTimer({
    isActive: timerActive,
    durationMs: turnDurationMs,
    deadlineTime: turnDeadlineTime,
  });
  const isInteractive =
    status === "playing" &&
    Boolean(currentSlot) &&
    currentTurn === currentSlot &&
    !isPlacing &&
    !isTimeUp;
  const isCurrentUserP1 = currentSlot ? currentSlot === "P1" : true;
  const playerColors = {
    P1: isCurrentUserP1 ? "text-primary" : "text-opponent",
    P2: isCurrentUserP1 ? "text-opponent" : "text-primary",
  };
  const displayBoard = toDisplayBoard(board, resolvedGridSize);
  const gridStyle = {
    gridTemplateColumns: `repeat(${resolvedGridSize}, minmax(0, 1fr))`,
  };
  const cellFontSize =
    resolvedGridSize <= 4
      ? `clamp(4rem, ${50 / resolvedGridSize}vw, 6rem)`
      : `clamp(3rem, ${30 / resolvedGridSize}vw, 5rem)`;
  const gridGapClasses =
    resolvedGridSize > 4 ? "gap-1 sm:gap-2" : "gap-2 sm:gap-3";
  return (
    <Card
      className={cn(
        "relative px-4 py-4 shadow-[0_14px_30px_-22px_rgba(0,0,0,0.5)]",
        {
          "border border-destructive/60": isTimeUp,
        },
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[min(100vw,85vh)]">
        <div
          className={cn("grid aspect-square", gridGapClasses)}
          style={gridStyle}
        >
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
                    "grid aspect-square place-items-center rounded-2xl border border-border/70 bg-secondary font-semibold transition",
                    {
                      "cursor-pointer hover:border-primary/60 hover:bg-primary/10":
                        !isDisabled,
                      "cursor-not-allowed opacity-60": isDisabled,
                    },
                  )}
                  style={{ fontSize: cellFontSize }}
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
      <Activity name={"time-up"} mode={isTimeUp ? "visible" : "hidden"}>
        <div className="absolute inset-0 bg-card/40 text-destructive backdrop-blur-xs">
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
            <TimerOff className="size-20" />
            <span className="text-3xl font-semibold uppercase tracking-[0.3em] leading-none">
              <span className="block">time's</span>
              <span className="block">up!</span>
            </span>
          </div>
        </div>
      </Activity>
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
