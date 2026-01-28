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
  currentUser,
  opponentUser,
}: MatchResultOverlayProps): MatchResultViewModel => {
  const currentSlot = resolveCurrentSlot(currentUserId, p1UserId);
  const isWinner = currentSlot ? winner === currentSlot : false;

  if (isWinner) {
    return {
      title: "You win!",
      accent: "primary",
      icon: "trophy",
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

  return {
    title: "Match Ended",
    subtitle,
    accent: "primary",
    icon: "wifi",
    pill: "Match Incomplete",
    footer,
    primaryLabel: "Find New Match",
    secondaryLabel: "Back Home",
    changeModeLabel: "Change Mode",
    currentUser,
    opponentUser,
    isCurrentWinner: !isDisconnectLoser,
    isAbandonedByCurrentUser: isDisconnectLoser,
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
