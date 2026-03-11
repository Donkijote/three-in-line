import { Pencil } from "lucide-react-native";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { AvatarMoreOptions } from "@/ui/mobile/components/AvatarMoreOptions";
import { Small } from "@/ui/mobile/components/Typography";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/ui/mobile/components/ui/avatar";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { Visibility } from "@/ui/mobile/layout/components/Visibility";
import { useAvatarSection } from "@/ui/shared/settings/hooks/useAvatarSection";

export const AvatarSection = () => {
  const { avatarSrc, fallbackInitials, isUpdating, onAcceptAvatar } =
    useAvatarSection();

  return (
    <View className="items-center pb-2 pt-4">
      <AvatarMoreOptions onAccept={onAcceptAvatar} disabled={isUpdating}>
        <View className="relative">
          <View style={styles.avatarShadow}>
            <Avatar
              alt={fallbackInitials}
              className="size-24 border-2 border-black/90"
              style={isUpdating ? styles.avatarUpdating : undefined}
            >
              {avatarSrc ? <AvatarImage source={{ uri: avatarSrc }} /> : null}
              <AvatarFallback className="bg-muted">
                <Small className="text-lg font-semibold text-foreground">
                  {fallbackInitials}
                </Small>
              </AvatarFallback>
              <Visibility visible={isUpdating}>
                <View style={styles.avatarLoadingOverlay}>
                  <ActivityIndicator size="small" color="#ffffff" />
                </View>
              </Visibility>
            </Avatar>
          </View>
          <AvatarBadge>
            <Icon as={Pencil} className="size-3.5 text-primary-foreground" />
          </AvatarBadge>
        </View>
      </AvatarMoreOptions>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 999,
    justifyContent: "center",
  },
  avatarUpdating: {
    opacity: 0.8,
  },
  avatarShadow: {
    elevation: 10,
    shadowColor: "#92E6BE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
  },
});
