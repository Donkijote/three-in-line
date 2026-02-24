import { ShieldX } from "lucide-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/ui/mobile/components/ui/alert-dialog";
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
    <AlertDialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <AlertDialogContent
        overlayClassName="items-stretch justify-end"
        className="w-auto max-w-none border border-destructive bg-card/95 shadow-[0_0_10px_rgba(255,64,64,0.35),0_0_24px_rgba(255,64,64,0.2)]"
        style={{
          alignSelf: "stretch",
          marginBottom: Math.max(insets.bottom, 12),
          marginHorizontal: Math.max(Math.max(insets.left, insets.right), 12),
        }}
      >
        <AlertDialogHeader className="flex-row items-start gap-3">
          <View className="mt-1 size-10 items-center justify-center rounded-full bg-destructive/15 border border-destructive/40">
            <Icon as={ShieldX} size={16} className="text-destructive" />
          </View>
          <View className="flex-1 gap-1">
            <AlertDialogTitle className="w-full text-destructive font-semibold uppercase tracking-widest">
              Authentication failed
            </AlertDialogTitle>
            <AlertDialogDescription className="leading-5 text-muted-foreground">
              {message}
            </AlertDialogDescription>
          </View>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <View className="w-full items-center">
            <AlertDialogAction
              onPress={onClose}
              className="h-11 rounded-full bg-primary active:bg-primary/90 w-1/3"
            >
              <Text className="font-semibold uppercase text-primary-foreground">
                Try again
              </Text>
            </AlertDialogAction>
          </View>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const getAuthErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim()) {
    if (error.message.toLowerCase().includes("invalid")) {
      return "We couldn't get you into the arena. Please check your credentials and try again.";
    }

    return error.message;
  }

  return "We couldn't get you into the arena. Please check your credentials and try again.";
};
