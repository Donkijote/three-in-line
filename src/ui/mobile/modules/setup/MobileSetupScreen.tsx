import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const MobileSetupScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />
      <View className="flex-1 gap-4 px-6 pt-8">
        <View className="self-start rounded-full bg-[#DCEBFF] px-3 py-1.5">
          <Text className="text-xs font-bold tracking-wide text-accent">
            MOBILE MILESTONE
          </Text>
        </View>

        <Text className="text-[34px] font-extrabold text-text">
          Three In Line
        </Text>
        <Text className="text-base text-muted">
          React Native + Expo foundation is ready.
        </Text>

        <View className="mt-2 gap-2 rounded-2xl border border-border bg-surface p-4">
          <Text className="text-lg font-bold text-text">Architecture</Text>
          <Text className="text-sm text-muted">
            - UI mobile adapter in src/ui/mobile
          </Text>
          <Text className="text-sm text-muted">
            - Shared domain and application layers
          </Text>
          <Text className="text-sm text-muted">
            - Infra adapters remain outside UI
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
