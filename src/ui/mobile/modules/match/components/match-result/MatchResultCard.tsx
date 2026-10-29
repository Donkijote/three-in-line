import { View } from "react-native";

import type { UserAvatar } from "@/domain/entities/Avatar";
import { Small } from "@/ui/mobile/components/Typography";
import { Visibility } from "@/ui/mobile/layout/components/Visibility";
import { MatchResultPlayerBadge } from "@/ui/mobile/modules/match/components/MatchResultPlayerBadge";

type MatchResultCardProps = {
  currentUser: {
    name: string;
    avatar?: UserAvatar;
  };
  opponentUser: {
    name: string;
    avatar?: UserAvatar;
  };
  isWinner: boolean;
  pill?: string;
  footer?: string;
  score?: {
    current: number;
    opponent: number;
  };
};

export const MatchResultCard = ({
  currentUser,
  opponentUser,
  isWinner,
  pill,
  footer,
  score,
}: MatchResultCardProps) => {
  const currentAccentClassName = isWinner ? "text-primary" : "text-destructive";
  const opponentAccentClassName = isWinner
    ? "text-destructive"
    : "text-primary";

  return (
    <View className="rounded-[1.5rem] border border-border/60 bg-secondary/50 px-4 py-4">
      <Visibility visible={Boolean(pill)}>
        <View className="mb-4 items-center">
          <Small className="rounded-full bg-secondary px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {pill}
          </Small>
        </View>
      </Visibility>
      <View className="flex-row items-center justify-between gap-4">
        <MatchResultPlayerBadge
          label="You"
          name={currentUser.name}
          avatar={currentUser.avatar}
          score={score?.current}
          accentClassName={currentAccentClassName}
          isWinner={isWinner}
        />
        <View className="items-center gap-1">
          <Small className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Final
          </Small>
          <Small className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Result
          </Small>
        </View>
        <MatchResultPlayerBadge
          label="Opponent"
          name={opponentUser.name}
          avatar={opponentUser.avatar}
          score={score?.opponent}
          accentClassName={opponentAccentClassName}
          isWinner={!isWinner}
          align="right"
        />
      </View>
      <Visibility visible={Boolean(footer)}>
        <View className="mt-4 border-t border-border/60 pt-4">
          <Small className="text-center text-[10px] uppercase tracking-[0.18em] text-primary">
            {footer}
          </Small>
        </View>
      </Visibility>
    </View>
  );
};
