import type { MatchState } from "@/domain/entities/Game";
import { buildMatchPlayers, type MatchUser } from "@/ui/shared/match/utils";
import { cn } from "@/ui/web/lib/utils";
import { PlayerCard } from "@/ui/web/modules/match/components/PlayerCard";

type MatchPlayersLayout = "desktop" | "mobile";

type MatchPlayersProps = {
  p1UserId: string;
  currentTurn: "P1" | "P2";
  timerActive: boolean;
  timerProgress: number;
  currentUser: MatchUser;
  opponentUser: MatchUser;
  match: MatchState | null;
  layout: MatchPlayersLayout;
};

export const MatchPlayers = ({
  p1UserId,
  currentTurn,
  timerActive,
  timerProgress,
  currentUser,
  opponentUser,
  match,
  layout,
}: MatchPlayersProps) => {
  const players = buildMatchPlayers(
    p1UserId,
    currentTurn,
    currentUser,
    opponentUser,
    match,
  );
  const showWins = Boolean(match && match.format !== "single");

  return (
    <div
      className={cn("grid gap-6", {
        "grid-cols-2": layout === "mobile",
      })}
    >
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          showWins={showWins}
          turnTimer={
            timerActive && player.isTurn
              ? { isActive: true, progress: timerProgress }
              : undefined
          }
          {...player}
        />
      ))}
    </div>
  );
};
