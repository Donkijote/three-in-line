import { View } from "react-native";

import { Text } from "@/ui/mobile/components/ui/text";

export const MobileLoginScreen = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text variant="h2">Mock Login Screen</Text>
      <Text variant="muted" className="mt-2 text-center">
        Login screen placeholder content.
      </Text>
    </View>
  );
};
