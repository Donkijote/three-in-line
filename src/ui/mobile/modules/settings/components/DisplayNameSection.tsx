import { CircleCheck, CircleX } from "lucide-react-native";
import { ActivityIndicator, View } from "react-native";

import { Small } from "@/ui/mobile/components/Typography";
import { Button } from "@/ui/mobile/components/ui/button";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { Input } from "@/ui/mobile/components/ui/input";
import { Text } from "@/ui/mobile/components/ui/text";
import { useDisplayNameSection } from "@/ui/shared/settings/hooks/useDisplayNameSection";

export const DisplayNameSection = () => {
  const {
    displayName,
    isBusy,
    isUpdating,
    onAcceptDisplayName,
    onDisplayNameChanged,
    shouldShowAccept,
    status,
  } = useDisplayNameSection();

  const renderStatusIcon = () => {
    if (isBusy) {
      return <ActivityIndicator size="small" color="hsl(0 0% 45.15%)" />;
    }

    if (status === "empty" || status === "idle") {
      return null;
    }

    return status === "taken" ? (
      <Icon as={CircleX} className="text-destructive" size={18} />
    ) : (
      <Icon as={CircleCheck} className="text-primary" size={18} />
    );
  };

  return (
    <View className="gap-2">
      <View className="h-8 flex-row items-center justify-between">
        <Small variant="label" className="text-muted-foreground">
          Display Name
        </Small>
        {shouldShowAccept ? (
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-full"
            onPress={() => void onAcceptDisplayName()}
            disabled={isUpdating}
          >
            <Text className="text-primary uppercase tracking-[1px]">
              Accept
            </Text>
          </Button>
        ) : null}
      </View>

      <View className="relative">
        <Input
          placeholder="PixelMaster_99"
          value={displayName}
          onChangeText={onDisplayNameChanged}
          editable={!isUpdating}
          autoCapitalize="none"
          autoCorrect={false}
          className="h-12 bg-card pr-12 text-foreground placeholder:text-muted-foreground/70"
        />
        <View
          className="absolute right-2 top-1 h-10 w-10 items-center justify-center rounded-full"
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {renderStatusIcon()}
        </View>
      </View>
    </View>
  );
};
