import { useEffect, useState } from "react";

import type { UserAvatar } from "@/domain/entities/Avatar";
import { resolveAvatarSrc } from "@/domain/entities/Avatar";
import type { GameStatus, MatchState } from "@/domain/entities/Game";
import { resolvePlayerLabel } from "@/ui/web/lib/user";
import { cn } from "@/ui/web/lib/utils";
import { PlayerCard } from "@/ui/web/modules/match/components/PlayerCard";

type MatchPlayersLayout = "desktop" | "mobile";

type MatchUser = {
  id?: string;
  username?: string | null;
  name?: string | null;
  email?: string | null;
  avatar?: UserAvatar;
};

type MatchPlayer = {
  id: string;
  name: string;
  symbol: "X" | "O";
  wins: number;
  isTurn: boolean;
  avatar?: string;
  accent: "primary" | "opponent";
};

type MatchPlayersProps = {
  p1UserId: string;
  currentTurn: "P1" | "P2";
  status: GameStatus;
  turnDurationMs: number | null;
  turnDeadlineTime: number | null;
  currentUser: MatchUser;
  opponentUser: MatchUser;
  match: MatchState | null;
  layout: MatchPlayersLayout;
};

export const MatchPlayers = ({
  p1UserId,
  currentTurn,
  status,
  turnDurationMs,
  turnDeadlineTime,
  currentUser,
  opponentUser,
  match,
  layout,
}: MatchPlayersProps) => {
  const timerEnabled = turnDurationMs !== null;
  const timerActive =
    timerEnabled && status === "playing" && turnDeadlineTime !== null;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!timerActive) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 100);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [timerActive]);

  const remainingMs =
    timerActive && turnDurationMs
      ? Math.max(
          Math.min((turnDeadlineTime ?? 0) - now, turnDurationMs),
          0,
        )
      : 0;
  const timerProgress =
    timerActive && turnDurationMs ? remainingMs / turnDurationMs : 0;

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

const resolvePlayerAvatar = (value: MatchUser) =>
  resolveAvatarSrc(value?.avatar);

const buildMatchPlayers = (
  p1UserId: string,
  currentTurn: "P1" | "P2",
  currentUser: MatchUser,
  opponentUser: MatchUser,
  match: MatchState | null,
): MatchPlayer[] => {
  const currentUserId = currentUser?.id;
  const isP1 = !currentUserId || p1UserId === currentUserId;
  const mySymbol: "X" | "O" = isP1 ? "X" : "O";
  const opponentSymbol: "X" | "O" = isP1 ? "O" : "X";
  const myTurnSlot = isP1 ? "P1" : "P2";
  const opponentTurnSlot = isP1 ? "P2" : "P1";
  const matchScore = match?.score;

  return [
    {
      id: "player-me",
      name: resolvePlayerLabel(currentUser, "You", {
        useInitialsFallback: true,
      }),
      symbol: mySymbol,
      wins: matchScore?.[myTurnSlot] ?? 0,
      isTurn: currentTurn === myTurnSlot,
      accent: "primary",
      avatar: resolvePlayerAvatar(currentUser),
    },
    {
      id: "player-opponent",
      name: resolvePlayerLabel(opponentUser, "P2", {
        useInitialsFallback: true,
      }),
      symbol: opponentSymbol,
      wins: matchScore?.[opponentTurnSlot] ?? 0,
      isTurn: currentTurn === opponentTurnSlot,
      accent: "opponent",
      avatar: resolvePlayerAvatar(opponentUser),
    },
  ];
};
