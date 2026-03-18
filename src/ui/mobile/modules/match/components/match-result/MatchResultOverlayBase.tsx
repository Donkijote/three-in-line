import { Modal, View } from "react-native";

import { Card, CardContent } from "@/ui/mobile/components/ui/card";

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
  onPrimaryAction,
}: MatchResultViewModel & { onPrimaryAction: () => Promise<void> }) => {
  return (
    <Modal transparent visible animationType="fade">
      <View className="flex-1 justify-center bg-background/95 px-6">
        <Card className="rounded-[2rem] border-border/70 px-0 py-0 shadow-[0_18px_35px_-26px_rgba(0,0,0,0.5)]">
          <CardContent className="gap-6 px-6 py-6">
            <MatchResultHeader
              title={title}
              subtitle={subtitle}
              accent={accent}
              icon={icon}
            />
            <MatchResultCard
              currentUser={currentUser}
              opponentUser={opponentUser}
              isWinner={isCurrentWinner}
              pill={pill}
              footer={footer}
              score={score}
            />
            <MatchResultActions
              accent={accent}
              primaryLabel={primaryLabel}
              secondaryLabel={secondaryLabel}
              changeModeLabel={changeModeLabel}
              onPrimaryAction={onPrimaryAction}
            />
          </CardContent>
        </Card>
      </View>
    </Modal>
  );
};
