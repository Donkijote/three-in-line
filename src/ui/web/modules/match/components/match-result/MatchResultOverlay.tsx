import type {
  MatchResultOverlayProps,
  MatchResultViewModel,
} from "./MatchResultOverlay.types";
import { MatchResultOverlayBase } from "./MatchResultOverlayBase";

export const MatchResultOverlay = (props: MatchResultOverlayProps) => {
  if (!props.isOpen) {
    return null;
  }

  if (props.result === "disconnect") {
    return <MatchResultOverlayBase {...toDisconnectModel(props)} />;
  }

  return <MatchResultOverlayBase {...toWinLossModel(props)} />;
};

const toWinLossModel = ({
  isWinner,
  currentUser,
  opponentUser,
}: MatchResultOverlayProps): MatchResultViewModel => {
  if (isWinner) {
    return {
      title: "You win!",
      accent: "primary",
      icon: "trophy",
      primaryLabel: "Play Again",
      secondaryLabel: "Back to Home",
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
    primaryLabel: "Rematch",
    secondaryLabel: "EXIT",
    currentUser,
    opponentUser,
    isCurrentWinner: false,
  };
};

const toDisconnectModel = ({
  isAbandonedByCurrentUser,
  currentUser,
  opponentUser,
}: MatchResultOverlayProps): MatchResultViewModel => {
  const isDisconnectLoser = Boolean(isAbandonedByCurrentUser);
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
    primaryLabel: "Find New Match",
    secondaryLabel: "Back to Home",
    currentUser,
    opponentUser,
    isCurrentWinner: !isDisconnectLoser,
    isAbandonedByCurrentUser,
  };
};
