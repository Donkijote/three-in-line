import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

import { H1, Lead } from "@/ui/mobile/components/Typography";
import { LoginForm } from "@/ui/mobile/modules/login/components/LoginForm";

export const LoginScreen = () => {
  return (
    <View className="flex-1 overflow-hidden">
      <LinearGradient
        colors={["rgba(20, 199, 145, 0.24)", "rgba(20, 199, 145, 0)"]}
        start={{ x: 0.05, y: 0 }}
        end={{ x: 0.7, y: 0.7 }}
        style={{
          height: 280,
          left: -80,
          position: "absolute",
          top: -70,
          width: 280,
        }}
      />

      <View className="flex-1 px-7 pt-6">
        <View className="gap-4 pt-4">
          <View className="h-1 w-12 rounded-full bg-primary" />
          <H1 className="text-left text-6xl uppercase leading-[56px]">
            NEW{"\n"}GAME
          </H1>
          <Lead className="text-base">
            Enter the arena. Choose your identity.
          </Lead>
        </View>

        <View className="flex-1 pt-8 pb-6">
          <LoginForm />
        </View>
      </View>
    </View>
  );
};
