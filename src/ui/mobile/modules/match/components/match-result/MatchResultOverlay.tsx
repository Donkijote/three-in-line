import { getMatchResultViewModel } from "@/ui/shared/match/utils";

import type { MatchResultOverlayProps } from "./MatchResultOverlay.types";
import { MatchResultOverlayBase } from "./MatchResultOverlayBase";

export const MatchResultOverlay = ({
  status,
  endedReason,
  winner,
  abandonedBy,
  p1UserId,
  currentUserId,
  score,
  currentUser,
  opponentUser,
  onPrimaryAction,
}: MatchResultOverlayProps) => {
  const viewModel = getMatchResultViewModel({
    status,
    endedReason,
    winner,
    abandonedBy,
    p1UserId,
    currentUserId,
    score,
    currentUser,
    opponentUser,
  });

  if (!viewModel) {
    return null;
  }

  return (
    <MatchResultOverlayBase {...viewModel} onPrimaryAction={onPrimaryAction} />
  );
};
