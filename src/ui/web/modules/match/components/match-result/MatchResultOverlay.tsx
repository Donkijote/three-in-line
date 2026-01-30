import type {
  MatchResultOverlayProps,
  MatchResultViewModel,
} from "./MatchResultOverlay.types";
import { MatchResultOverlayBase } from "./MatchResultOverlayBase";

export const MatchResultOverlay = (props: MatchResultOverlayProps) => {
  if (props.status !== "ended") {
    return null;
  }

  if (props.endedReason === "disconnect") {
    return (
      <MatchResultOverlayBase
        {...toDisconnectModel(props)}
        onPrimaryAction={props.onPrimaryAction}
      />
    );
  }

  if (props.endedReason === "abandoned") {
    const currentSlot = resolveCurrentSlot(props.currentUserId, props.p1UserId);
    if (currentSlot && props.abandonedBy === currentSlot) {
      return null;
    }
    return (
      <MatchResultOverlayBase
        {...toAbandonedModel(props)}
        onPrimaryAction={props.onPrimaryAction}
      />
    );
  }

  if (props.endedReason === "win") {
    return (
      <MatchResultOverlayBase
        {...toWinLossModel(props)}
        onPrimaryAction={props.onPrimaryAction}
      />
    );
  }

  return null;
};

const toWinLossModel = ({
  winner,
  currentUserId,
  p1UserId,
  score,
  currentUser,
  opponentUser,
}: MatchResultOverlayProps): MatchResultViewModel => {
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
};

const toDisconnectModel = ({
  abandonedBy,
  currentUserId,
  p1UserId,
  score,
  currentUser,
  opponentUser,
}: MatchResultOverlayProps): MatchResultViewModel => {
  const currentSlot = resolveCurrentSlot(currentUserId, p1UserId);
  const isDisconnectLoser = Boolean(currentSlot) && abandonedBy === currentSlot;
  const subtitle = isDisconnectLoser
    ? "You left the match and ended the game."
    : "Your opponent has left the game.";
  const footer = isDisconnectLoser
    ? "You forfeited the match"
    : "Win by Forfeit";
  const resolvedScore = resolveMatchScore(score, currentSlot);

  return {
    title: "Match Ended",
    subtitle,
    accent: "primary",
    icon: "wifi",
    pill: "Match Incomplete",
    footer,
    score: resolvedScore,
    primaryLabel: "Find New Match",
    secondaryLabel: "Back Home",
    changeModeLabel: "Change Mode",
    currentUser,
    opponentUser,
    isCurrentWinner: !isDisconnectLoser,
    isAbandonedByCurrentUser: isDisconnectLoser,
  };
};

const toAbandonedModel = ({
  abandonedBy,
  winner,
  currentUserId,
  p1UserId,
  score,
  currentUser,
  opponentUser,
}: MatchResultOverlayProps): MatchResultViewModel => {
  const currentSlot = resolveCurrentSlot(currentUserId, p1UserId);
  const isCurrentWinner = currentSlot ? winner === currentSlot : false;
  const resolvedScore = resolveMatchScore(score, currentSlot);
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
    score: resolvedScore,
    primaryLabel: "Find New Match",
    secondaryLabel: "Back Home",
    changeModeLabel: "Change Mode",
    currentUser,
    opponentUser,
    isCurrentWinner,
    isAbandonedByCurrentUser:
      Boolean(currentSlot) && abandonedBy === currentSlot,
  };
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

const resolveMatchScore = (
  score: MatchResultOverlayProps["score"],
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
