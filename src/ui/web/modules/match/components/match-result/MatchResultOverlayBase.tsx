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
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/95 px-6 py-8">
      <div className="relative w-full max-w-sm">
        <div className="pointer-events-none absolute -top-12 left-1/2 size-28 -translate-x-1/2 rounded-full bg-linear-to-b from-black/0 via-black/0 to-black/50 blur-2xl" />

        <div className="flex flex-col items-center gap-16 text-center">
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
