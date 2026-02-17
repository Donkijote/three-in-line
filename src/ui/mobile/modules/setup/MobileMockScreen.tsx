import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/ui/mobile/components/ui/button";
import { Text } from "@/ui/mobile/components/ui/text";

type MobileMockScreenProps = {
  onGoBack?: () => void;
};

export const MobileMockScreen = ({ onGoBack }: MobileMockScreenProps) => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />
      <View className="flex-1 gap-4 bg-background px-6 pt-8">
        <Text variant="h2">Mock Screen</Text>
        <Text variant="muted">
          Expo Router navigation is working. This is a dummy destination screen.
        </Text>

        <Button variant="secondary" onPress={onGoBack}>
          <Text>Go Back</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};
