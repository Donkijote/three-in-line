import { MatchResultActions } from "./MatchResultActions";
import { MatchResultCard } from "./MatchResultCard";
import { MatchResultHeader } from "./MatchResultHeader";
import type { MatchResultViewModel } from "./MatchResultOverlay.types";

export const MatchResultOverlayBase = ({
  title,
  subtitle,
  accent,
  icon,
  pill,
  footer,
  score,
  primaryLabel,
  secondaryLabel,
  changeModeLabel,
  currentUser,
  opponentUser,
  isCurrentWinner,
  isAbandonedByCurrentUser,
  onPrimaryAction,
}: MatchResultViewModel & { onPrimaryAction: () => Promise<void> }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center bg-background/95 px-6 py-8">
      <div className="relative flex h-full w-full max-w-sm flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-16 text-center">
          <MatchResultHeader
            title={title}
            subtitle={subtitle}
            accent={accent}
            icon={icon}
          />

          <MatchResultCard
            pill={pill}
            footer={footer}
            score={score}
            currentUser={currentUser}
            opponentUser={opponentUser}
            isWinner={isCurrentWinner}
            isAbandonedByCurrentUser={isAbandonedByCurrentUser}
          />
        </div>
        <div className="mt-auto">
          <MatchResultActions
            accent={accent}
            primaryLabel={primaryLabel}
            secondaryLabel={secondaryLabel}
            changeModeLabel={changeModeLabel}
            onPrimaryAction={onPrimaryAction}
          />
        </div>
      </div>
    </div>
  );
};
