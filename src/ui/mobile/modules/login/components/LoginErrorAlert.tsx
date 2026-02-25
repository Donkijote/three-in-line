import { ShieldX } from "lucide-react-native";
import { Modal, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/ui/mobile/components/ui/button";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { Text } from "@/ui/mobile/components/ui/text";

type LoginErrorAlertProps = {
  error: unknown;
  onClose: () => void;
};

export const LoginErrorAlert = ({ error, onClose }: LoginErrorAlertProps) => {
  const message = getAuthErrorMessage(error);
  const isOpen = Boolean(error);
  const insets = useSafeAreaInsets();

  return (
    <Modal transparent visible={isOpen} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-black/50" onPress={onClose} />
        <View
          className="px-3"
          style={{
            paddingBottom: Math.max(insets.bottom, 12),
            paddingHorizontal: Math.max(Math.max(insets.left, insets.right), 12),
          }}
        >
          <View className="w-full rounded-4xl border border-destructive bg-card/95 px-5 pb-5 pt-5 shadow-[0_0_10px_rgba(255,64,64,0.35),0_0_24px_rgba(255,64,64,0.2)]">
            <View className="flex-row items-start gap-3">
              <View className="mt-1 size-10 items-center justify-center rounded-full border border-destructive/40 bg-destructive/15">
                <Icon as={ShieldX} size={16} className="text-destructive" />
              </View>
              <View className="flex-1 gap-1">
                <Text className="w-full text-destructive text-lg font-semibold uppercase tracking-widest">
                  Authentication failed
                </Text>
                <Text className="leading-5 text-muted-foreground">{message}</Text>
              </View>
            </View>

            <View className="mt-4 w-full items-center">
              <Button
                onPress={onClose}
                className="h-11 w-full rounded-full bg-primary active:bg-primary/90"
              >
                <Text className="font-semibold uppercase text-primary-foreground">
                  Try again
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getAuthErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim()) {
    const normalizedMessage = error.message.trim();
    const lowerMessage = normalizedMessage.toLowerCase();
    const hasStackLikeContent =
      normalizedMessage.includes("\n") ||
      normalizedMessage.includes(" at ") ||
      lowerMessage.includes("call stack") ||
      lowerMessage.includes("node_modules/");

    if (hasStackLikeContent) {
      return "We couldn't get you into the arena. Please try again.";
    }

    if (lowerMessage.includes("invalid")) {
      return "We couldn't get you into the arena. Please check your credentials and try again.";
    }

    return normalizedMessage;
  }

  return "We couldn't get you into the arena. Please check your credentials and try again.";
};
