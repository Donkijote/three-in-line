import { View } from "react-native";

import type { MatchState } from "@/domain/entities/Game";
import { buildMatchPlayers, type MatchUser } from "@/ui/shared/match/utils";

import { PlayerCard } from "./PlayerCard";

type MatchPlayersProps = {
  p1UserId: string;
  currentTurn: "P1" | "P2";
  timerActive: boolean;
  timerProgress: number;
  currentUser: MatchUser;
  opponentUser: MatchUser;
  match: MatchState | null;
};

export const MatchPlayers = ({
  p1UserId,
  currentTurn,
  timerActive,
  timerProgress,
  currentUser,
  opponentUser,
  match,
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
    <View className="flex-row gap-3">
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
    </View>
  );
};
