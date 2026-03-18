import { getMatchResultViewModel } from "@/ui/shared/match/utils";
import { useMatchResultOverlaySound } from "@/ui/web/hooks/useMatchSound";

import type { MatchResultOverlayProps } from "./MatchResultOverlay.types";
import { MatchResultOverlayBase } from "./MatchResultOverlayBase";

export const MatchResultOverlay = (props: MatchResultOverlayProps) => {
  const {
    soundEnabled,
    hapticsEnabled,
    status,
    endedReason,
    winner,
    abandonedBy,
    p1UserId,
    currentUserId,
    onPrimaryAction,
  } = props;
  useMatchResultOverlaySound({
    soundEnabled,
    hapticsEnabled,
    status,
    endedReason,
    winner,
    abandonedBy,
    p1UserId,
    currentUserId,
  });

  const viewModel = getMatchResultViewModel({
    status,
    endedReason,
    winner,
    abandonedBy,
    p1UserId,
    currentUserId,
    score: props.score,
    currentUser: props.currentUser,
    opponentUser: props.opponentUser,
  });

  if (viewModel) {
    return (
      <MatchResultOverlayBase
        {...viewModel}
        onPrimaryAction={onPrimaryAction}
      />
    );
  }

  return null;
};
