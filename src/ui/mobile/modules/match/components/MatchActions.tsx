import { Flag } from "lucide-react-native";
import { View } from "react-native";

import type { MatchState } from "@/domain/entities/Game";
import { Small } from "@/ui/mobile/components/Typography";
import { Button } from "@/ui/mobile/components/ui/button";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { Text } from "@/ui/mobile/components/ui/text";
import { Visibility } from "@/ui/mobile/layout/components/Visibility";

type MatchActionsProps = {
  match: MatchState | null;
  isAbandoning: boolean;
  onAbandonMatch: () => Promise<void>;
};

export const MatchActions = ({
  match,
  isAbandoning,
  onAbandonMatch,
}: MatchActionsProps) => {
  const showRoundCounter = Boolean(match && match.format !== "single");
  const bestOf = match ? match.targetWins * 2 - 1 : 1;

  return (
    <View className="gap-4">
      <Visibility visible={showRoundCounter}>
        <View className="items-center">
          <View className="rounded-full border border-border/60 bg-card px-4 py-2">
            <Small className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Round {match?.roundIndex ?? 1} · Best of {bestOf}
            </Small>
          </View>
        </View>
      </Visibility>

      <Button
        variant="outline"
        className="h-12 rounded-full border-destructive/30 bg-secondary"
        onPress={() => void onAbandonMatch()}
        disabled={isAbandoning}
      >
        <Icon as={Flag} className="text-destructive" size={16} />
        <Text className="font-semibold text-destructive">
          {isAbandoning ? "Abandoning..." : "Abandon Match"}
        </Text>
      </Button>
    </View>
  );
};
