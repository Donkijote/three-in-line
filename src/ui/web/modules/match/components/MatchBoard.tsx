import { Card } from "@/ui/web/components/ui/card";
import { cn } from "@/ui/web/lib/utils";

type MatchBoardProps = {
  board: string[][];
  className?: string;
};

export const MatchBoard = ({ board, className }: MatchBoardProps) => {
  return (
    <Card className={cn("px-4 py-4 shadow-[0_14px_30px_-22px_rgba(0,0,0,0.5)]", className)}>
      <div className="grid grid-cols-3 gap-3">
        {board.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const key = `${rowIndex}-${colIndex}`;
            return (
              <div
                key={key}
                className="grid aspect-square place-items-center rounded-2xl border border-border/70 bg-secondary text-3xl font-semibold"
              >
                <span
                  className={cn(
                    cell === "X" && "text-primary",
                    cell === "O" && "text-foreground/90",
                  )}
                >
                  {cell || ""}
                </span>
              </div>
            );
          }),
        )}
      </div>
    </Card>
  );
};
