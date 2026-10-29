import type { UserAvatar } from "@/domain/entities/Avatar";
import { resolveAvatarSrc } from "@/domain/entities/Avatar";
import type {
  BoardCell,
  Game,
  GameEndedReason,
  GameStatus,
  MatchScore,
  MatchState,
  PlayerSlot,
} from "@/domain/entities/Game";
import { resolvePlayerLabel } from "@/ui/shared/user/resolvePlayerLabel";

export type MatchUser = {
  id?: string;
  username?: string | null;
  name?: string | null;
  email?: string | null;
  avatar?: UserAvatar;
};

export type MatchPlayerViewModel = {
  id: string;
  name: string;
  symbol: "X" | "O";
  wins: number;
  isTurn: boolean;
  avatar?: string;
  accent: "primary" | "opponent";
};

export type MatchResultParticipant = {
  name: string;
  avatar?: UserAvatar;
};

export type MatchResultModelInput = {
  status: GameStatus;
  endedReason: GameEndedReason;
  winner: PlayerSlot | null;
  abandonedBy: PlayerSlot | null;
  p1UserId: string;
  currentUserId?: string;
  score?: MatchScore;
  currentUser: MatchResultParticipant;
  opponentUser: MatchResultParticipant;
};

export type MatchResultViewModel = {
  title: string;
  subtitle?: string;
  accent: "primary" | "destructive";
  icon: "trophy" | "heart" | "wifi" | "flag";
  pill?: string;
  footer?: string;
  score?: {
    current: number;
    opponent: number;
  };
  primaryLabel: string;
  secondaryLabel: string;
  changeModeLabel: string;
  currentUser: MatchResultParticipant;
  opponentUser: MatchResultParticipant;
  isCurrentWinner: boolean;
  isAbandonedByCurrentUser?: boolean;
};

export const resolveCurrentSlot = (
  currentUserId: string | undefined,
  p1UserId: string,
) => {
  if (!currentUserId) {
    return undefined;
  }

  return currentUserId === p1UserId ? "P1" : "P2";
};

export const getOpponentId = (
  game?: Pick<Game, "p1UserId" | "p2UserId"> | null,
  currentUserId?: string,
) => {
  if (!game) return undefined;

  if (!currentUserId) {
    return game.p2UserId ?? game.p1UserId;
  }

  return game.p1UserId === currentUserId ? game.p2UserId : game.p1UserId;
};

export const toDisplayBoard = (board: BoardCell[], gridSize: number) => {
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

export const buildMatchPlayers = (
  p1UserId: string,
  currentTurn: "P1" | "P2",
  currentUser: MatchUser,
  opponentUser: MatchUser,
  match: MatchState | null,
): MatchPlayerViewModel[] => {
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
      avatar: resolveAvatarSrc(currentUser?.avatar),
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
      avatar: resolveAvatarSrc(opponentUser?.avatar),
    },
  ];
};

export const getMatchResultViewModel = ({
  status,
  endedReason,
  winner,
  abandonedBy,
  p1UserId,
  currentUserId,
  score,
  currentUser,
  opponentUser,
}: MatchResultModelInput): MatchResultViewModel | null => {
  if (status !== "ended") {
    return null;
  }

  if (endedReason === "disconnect") {
    const currentSlot = resolveCurrentSlot(currentUserId, p1UserId);
    const isDisconnectLoser =
      Boolean(currentSlot) && abandonedBy === currentSlot;
    const subtitle = isDisconnectLoser
      ? "You left the match and ended the game."
      : "Your opponent has left the game.";
    const footer = isDisconnectLoser
      ? "You forfeited the match"
      : "Win by Forfeit";

    return {
      title: "Match Ended",
      subtitle,
      accent: "primary",
      icon: "wifi",
      pill: "Match Incomplete",
      footer,
      score: resolveMatchScore(score, currentSlot),
      primaryLabel: "Find New Match",
      secondaryLabel: "Back Home",
      changeModeLabel: "Change Mode",
      currentUser,
      opponentUser,
      isCurrentWinner: !isDisconnectLoser,
      isAbandonedByCurrentUser: isDisconnectLoser,
    };
  }

  if (endedReason === "abandoned") {
    const currentSlot = resolveCurrentSlot(currentUserId, p1UserId);
    if (currentSlot && abandonedBy === currentSlot) {
      return null;
    }

    const isCurrentWinner = currentSlot ? winner === currentSlot : false;
    const subtitle = isCurrentWinner
      ? "Your opponent abandoned the match."
      : "The match ended by abandonment.";
    const footer = isCurrentWinner ? "Win by Forfeit" : "Match ended";

    return {
      title: isCurrentWinner ? "Opponent Surrendered" : "Match Ended",
      subtitle,
      accent: "primary",
      icon: "flag",
      pill: "Match Complete",
      footer,
      score: resolveMatchScore(score, currentSlot),
      primaryLabel: "Find New Match",
      secondaryLabel: "Back Home",
      changeModeLabel: "Change Mode",
      currentUser,
      opponentUser,
      isCurrentWinner,
      isAbandonedByCurrentUser:
        Boolean(currentSlot) && abandonedBy === currentSlot,
    };
  }

  if (endedReason === "win") {
    const currentSlot = resolveCurrentSlot(currentUserId, p1UserId);
    const isWinner = currentSlot ? winner === currentSlot : false;
    const resolvedScore = resolveMatchScore(score, currentSlot);

    if (isWinner) {
      return {
        title: "You win!",
        accent: "primary",
        icon: "trophy",
        score: resolvedScore,
        primaryLabel: "Play Again",
        secondaryLabel: "Back Home",
        changeModeLabel: "Change Mode",
        currentUser,
        opponentUser,
        isCurrentWinner: true,
      };
    }

    return {
      title: "Defeat",
      subtitle: "Don't give up!\nYou were so close.",
      accent: "destructive",
      icon: "heart",
      score: resolvedScore,
      primaryLabel: "Rematch",
      secondaryLabel: "Back Home",
      changeModeLabel: "Change Mode",
      currentUser,
      opponentUser,
      isCurrentWinner: false,
    };
  }

  return null;
};

const resolveMatchScore = (
  score: MatchResultModelInput["score"],
  currentSlot: "P1" | "P2" | undefined,
) => {
  if (!score || !currentSlot) {
    return undefined;
  }

  const opponentSlot = currentSlot === "P1" ? "P2" : "P1";

  return {
    current: score[currentSlot],
    opponent: score[opponentSlot],
  };
};
