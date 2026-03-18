import { router } from "expo-router";
import { Home, RotateCcw, Shuffle } from "lucide-react-native";
import { View } from "react-native";

import { Button } from "@/ui/mobile/components/ui/button";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { Text } from "@/ui/mobile/components/ui/text";
import { cn } from "@/ui/mobile/lib/utils";
import type { ResultAccent } from "@/ui/shared/match/types/matchResultOverlay";

type MatchResultActionsProps = {
  accent: ResultAccent;
  primaryLabel: string;
  secondaryLabel: string;
  changeModeLabel: string;
  onPrimaryAction: () => Promise<void>;
};

export const MatchResultActions = ({
  accent,
  primaryLabel,
  secondaryLabel,
  changeModeLabel,
  onPrimaryAction,
}: MatchResultActionsProps) => {
  return (
    <View className="gap-3">
      <Button
        className={cn(
          "h-12 rounded-full",
          accent === "primary" ? "bg-primary" : "bg-destructive",
        )}
        onPress={() => void onPrimaryAction()}
      >
        <Icon as={RotateCcw} className="text-primary-foreground" />
        <Text className="font-semibold uppercase tracking-[0.18em] text-primary-foreground">
          {primaryLabel}
        </Text>
      </Button>
      <Button
        variant="secondary"
        className="h-12 rounded-full"
        onPress={() => router.replace("/play")}
      >
        <Icon as={Shuffle} />
        <Text className="font-semibold uppercase tracking-[0.18em]">
          {changeModeLabel}
        </Text>
      </Button>
      <Button
        variant="outline"
        className="h-12 rounded-full"
        onPress={() => router.replace("/")}
      >
        <Icon as={Home} />
        <Text className="font-semibold uppercase tracking-[0.18em]">
          {secondaryLabel}
        </Text>
      </Button>
    </View>
  );
};
