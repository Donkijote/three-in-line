import { View } from "react-native";

import { Small } from "@/ui/mobile/components/Typography";
import { Button } from "@/ui/mobile/components/ui/button";
import { Input } from "@/ui/mobile/components/ui/input";
import { Text } from "@/ui/mobile/components/ui/text";

import { AvatarOptions } from "./AvatarOptions";

export const LoginForm = () => {
  return (
    <View className="flex-1 gap-8">
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

        <View className="pt-3">
          <AvatarOptions />
        </View>
      </View>

      <Button
        size="lg"
        className="mt-auto h-12 rounded-full bg-primary active:bg-primary/90"
      >
        <Text className="font-semibold text-primary-foreground uppercase tracking-[1.2px]">
          START GAME
        </Text>
      </Button>
    </View>
  );
};
