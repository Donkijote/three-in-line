import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/mobile/components/ui/card";
import { Text } from "@/ui/mobile/components/ui/text";

export const MobileSetupScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />
      <View className="flex-1 gap-4 bg-background px-6 pt-8">
        <View className="self-start rounded-full bg-primary px-3 py-1.5">
          <Text
            variant="small"
            className="font-bold tracking-wide text-primary-foreground"
          >
            MOBILE MILESTONE
          </Text>
        </View>

        <Text variant="h1" className="text-left text-[34px]">
          Three In Line
        </Text>
        <Text variant="lead" className="text-base">
          React Native + Expo foundation is ready.
        </Text>

        <Card className="mt-2 gap-2 rounded-2xl py-2">
          <CardHeader className="">
            <CardTitle className="text-lg">Architecture</CardTitle>
          </CardHeader>
          <CardContent className="gap-2 pb-2">
            <Text variant="muted">- UI mobile adapter in src/ui/mobile</Text>
            <Text variant="muted">- Shared domain and application layers</Text>
            <Text variant="muted">- Infra adapters remain outside UI</Text>
          </CardContent>
        </Card>
      </View>
    </SafeAreaView>
  );
};
