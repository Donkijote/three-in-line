import { View } from "react-native";

import { Button } from "@/ui/mobile/components/ui/button";
import { Text } from "@/ui/mobile/components/ui/text";

type MobileMockScreenProps = {
  onGoBack?: () => void;
};

export const MobileMockScreen = ({ onGoBack }: MobileMockScreenProps) => {
  return (
    <View className="flex-1 gap-4">
      <Text variant="h2">Mock Screen</Text>
      <Text variant="muted">
        Expo Router navigation is working. This is a dummy destination screen.
      </Text>

      <Button variant="secondary" onPress={onGoBack}>
        <Text>Go Back</Text>
      </Button>
    </View>
  );
};
