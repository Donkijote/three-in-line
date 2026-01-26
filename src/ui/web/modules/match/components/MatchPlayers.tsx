import type { UserAvatar } from "@/domain/entities/Avatar";
import { resolveAvatarSrc } from "@/domain/entities/Avatar";
import { resolvePlayerLabel } from "@/ui/web/lib/user";
import { PlayerCard } from "@/ui/web/modules/match/components/PlayerCard";

type MatchPlayersLayout = "desktop" | "mobile";

type MatchGame = {
  p1UserId: string;
  p2UserId: string | null;
  currentTurn: "P1" | "P2";
};

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
  game: MatchGame;
  currentUser: MatchUser;
  opponentUser: MatchUser;
  layout: MatchPlayersLayout;
};

export const MatchPlayers = ({
  game,
  currentUser,
  opponentUser,
  layout,
}: MatchPlayersProps) => {
  const players = buildMatchPlayers(game, currentUser, opponentUser);
  const containerClassName =
    layout === "desktop" ? "grid gap-6" : "grid grid-cols-2 gap-6";

  return (
    <div className={containerClassName}>
      {players.map((player) => (
        <PlayerCard key={player.id} {...player} />
      ))}
    </div>
  );
};

const resolvePlayerName = (value: MatchUser) => {
  if (value?.username) {
    return value.username;
  }
  if (value?.name) {
    return value.name;
  }
  if (value?.email) {
    return value.email.split("@")[0] ?? value.email;
  }
  return "";
};

const resolvePlayerAvatar = (value: MatchUser) =>
  resolveAvatarSrc(value?.avatar);

const buildMatchPlayers = (
  game: MatchGame,
  currentUser: MatchUser,
  opponentUser: MatchUser,
): MatchPlayer[] => {
  const currentUserId = currentUser?.id;
  const isP1 = !currentUserId || game.p1UserId === currentUserId;
  const mySymbol: "X" | "O" = isP1 ? "X" : "O";
  const opponentSymbol: "X" | "O" = isP1 ? "O" : "X";
  const myTurnSlot = isP1 ? "P1" : "P2";
  const opponentTurnSlot = isP1 ? "P2" : "P1";

  return [
    {
      id: "player-me",
      name: resolvePlayerLabel(currentUser, "You", {
        useInitialsFallback: true,
      }),
      symbol: mySymbol,
      wins: 0,
      isTurn: game.currentTurn === myTurnSlot,
      accent: "primary",
      avatar: resolvePlayerAvatar(currentUser),
    },
    {
      id: "player-opponent",
      name: resolvePlayerLabel(opponentUser, "P2", {
        useInitialsFallback: true,
      }),
      symbol: opponentSymbol,
      wins: 0,
      isTurn: game.currentTurn === opponentTurnSlot,
      accent: "opponent",
      avatar: resolvePlayerAvatar(opponentUser),
    },
  ];
};
