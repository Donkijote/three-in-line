import type { MatchResultOverlayProps } from "@/ui/shared/match/types/matchResultOverlay";
import { getMatchResultViewModel } from "@/ui/shared/match/utils";

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
