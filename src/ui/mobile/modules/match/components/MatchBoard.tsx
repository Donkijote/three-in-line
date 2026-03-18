import { Circle, TimerOff, X } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { DEFAULT_GRID_SIZE, type GameStatus } from "@/domain/entities/Game";
import { H3, Muted } from "@/ui/mobile/components/Typography";
import { Card } from "@/ui/mobile/components/ui/card";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { cn } from "@/ui/mobile/lib/utils";
import { resolveCurrentSlot, toDisplayBoard } from "@/ui/shared/match/utils";

type MatchBoardProps = {
  board: Array<"P1" | "P2" | null>;
  gridSize?: number;
  status: GameStatus;
  currentTurn: "P1" | "P2";
  currentUserId?: string;
  p1UserId: string;
  isTimeUp?: boolean;
  isPlacing?: boolean;
  onCellPress?: (index: number) => void;
};

export const MatchBoard = ({
  board,
  gridSize,
  status,
  currentTurn,
  currentUserId,
  p1UserId,
  isTimeUp = false,
  isPlacing = false,
  onCellPress,
}: MatchBoardProps) => {
  const resolvedGridSize = gridSize ?? DEFAULT_GRID_SIZE;
  const currentSlot = resolveCurrentSlot(currentUserId, p1UserId);
  const isCurrentUserP1 = currentSlot ? currentSlot === "P1" : true;
  const displayBoard = toDisplayBoard(board, resolvedGridSize);
  const markSize = resolvedGridSize <= 4 ? 76 : 56;
  const currentPlayerClasses = {
    P1: isCurrentUserP1 ? "text-primary" : "text-opponent",
    P2: isCurrentUserP1 ? "text-opponent" : "text-primary",
  };

  return (
    <Card
      className={cn(
        "relative rounded-[2rem] border-border/70 px-4 py-4 shadow-none",
        {
          "border-destructive/60": isTimeUp,
        },
      )}
      style={{
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="gap-2">
        {displayBoard.map((row, rowIndex) => (
          <View key={`row-${rowIndex.toString()}`} className="flex-row gap-2">
            {row.map((cell, colIndex) => {
              const isCellTaken = cell !== "";
              const isKnownUser = Boolean(currentSlot);
              const isNotYourTurn =
                status === "playing" &&
                isKnownUser &&
                currentTurn !== currentSlot &&
                !isTimeUp;
              const isHardDisabled =
                status !== "playing" || !isKnownUser || isPlacing || isTimeUp;
              const isDisabled =
                isHardDisabled || isCellTaken || Boolean(isNotYourTurn);
              const index = rowIndex * resolvedGridSize + colIndex;

              return (
                <Pressable
                  key={`${rowIndex.toString()}-${colIndex.toString()}`}
                  accessibilityRole="button"
                  accessibilityLabel={`Match cell ${index + 1}`}
                  disabled={isHardDisabled}
                  className={cn(
                    "aspect-square flex-1 items-center justify-center rounded-3xl border border-border/70 bg-secondary",
                    {
                      "opacity-55": isDisabled,
                    },
                  )}
                  onPress={() => {
                    if (isCellTaken || isNotYourTurn) {
                      return;
                    }

                    onCellPress?.(index);
                  }}
                >
                  <BoardCellMark
                    mark={cell}
                    size={markSize}
                    className={
                      cell === "X"
                        ? currentPlayerClasses.P1
                        : currentPlayerClasses.P2
                    }
                  />
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
      {isTimeUp ? (
        <View className="absolute inset-0 items-center justify-center rounded-[2rem] bg-card/92 px-6">
          <View className="items-center gap-4">
            <View className="size-18 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10">
              <Icon as={TimerOff} className="size-9 text-destructive" />
            </View>
            <View className="items-center gap-1">
              <H3 className="text-center uppercase tracking-[0.2em] text-destructive">
                Time&apos;s up
              </H3>
              <Muted className="mt-0 text-center text-sm">
                Your turn expired before the move could be placed.
              </Muted>
            </View>
          </View>
        </View>
      ) : null}
    </Card>
  );
};

type BoardCellMarkProps = {
  mark: string;
  size: number;
  className: string;
};

const BoardCellMark = ({ mark, size, className }: BoardCellMarkProps) => {
  if (!mark) {
    return null;
  }

  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Icon
        as={mark === "X" ? X : Circle}
        className={className}
        size={size}
        strokeWidth={3}
      />
    </View>
  );
};
