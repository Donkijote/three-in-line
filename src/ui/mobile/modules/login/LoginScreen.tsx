import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

import { H1, Lead, Small } from "@/ui/mobile/components/Typography";
import { Button } from "@/ui/mobile/components/ui/button";
import { Input } from "@/ui/mobile/components/ui/input";
import { Text } from "@/ui/mobile/components/ui/text";

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

      <View className="flex-1 justify-between px-6 pt-6">
        <View className="gap-8 pt-4">
          <View className="h-1 w-12 rounded-full bg-primary" />
          <View className="gap-4">
            <H1 className="text-left text-6xl uppercase leading-[56px]">
              NEW{"\n"}GAME
            </H1>
            <Lead className="text-base">
              Enter the arena. Choose your identity.
            </Lead>
          </View>

          <View className="gap-5">
            <View className="gap-2">
              <Small variant="label" className="text-primary/90">
                Email
              </Small>
              <Input
                placeholder="you@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                className="h-14 bg-card text-foreground placeholder:text-muted-foreground/70"
              />
            </View>

            <View className="gap-2">
              <Small variant="label" className="text-primary/90">
                Password
              </Small>
              <Input
                placeholder="Enter password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                textContentType="password"
                autoComplete="password"
                className="h-14 bg-card text-foreground placeholder:text-muted-foreground/70"
              />
            </View>
          </View>
        </View>

        <Button
          size="lg"
          className="h-12 rounded-full bg-primary active:bg-primary/90"
        >
          <Text className="font-semibold text-primary-foreground uppercase tracking-[1.2px]">
            START GAME
          </Text>
        </Button>
      </View>
    </View>
  );
};
