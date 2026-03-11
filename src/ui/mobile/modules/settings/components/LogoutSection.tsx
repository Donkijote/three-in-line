import { LogOut } from "lucide-react-native";
import { View } from "react-native";

import { useAuthActions } from "@convex-dev/auth/react";

import { Button } from "@/ui/mobile/components/ui/button";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { Text } from "@/ui/mobile/components/ui/text";

export const LogoutSection = () => {
  const { signOut } = useAuthActions();

  return (
    <View className="items-center">
      <Button variant="link" onPress={() => void signOut()}>
        <Icon as={LogOut} className="text-muted-foreground/60" size={16} />
        <Text className="text-muted-foreground/60 group-active:no-underline">
          Log Out
        </Text>
      </Button>
    </View>
  );
};
