import { useState } from "react";

import { Pencil } from "lucide-react-native";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { isPresetAvatarId } from "@/domain/entities/Avatar";
import { AvatarMoreOptions } from "@/ui/mobile/components/AvatarMoreOptions";
import { Small } from "@/ui/mobile/components/Typography";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/ui/mobile/components/ui/avatar";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { useCurrentUser, useUpdateAvatar } from "@/ui/mobile/hooks/useUser";
import { Visibility } from "@/ui/mobile/layout/components/Visibility";
import { type AvatarPreset, getPresetAvatarById } from "@/ui/shared/avatars";
import { getFallbackInitials } from "@/ui/shared/user/initials";

export const AvatarSection = () => {
  const currentUser = useCurrentUser();
  const updateAvatar = useUpdateAvatar();
  const [isUpdating, setIsUpdating] = useState(false);
  const avatar = currentUser?.avatar;
  const avatarSrc =
    avatar?.type === "preset" && isPresetAvatarId(avatar.value)
      ? getPresetAvatarById(avatar.value).src
      : (avatar?.value ?? currentUser?.image ?? null);
  const fallbackInitials = getFallbackInitials({
    name: currentUser?.name,
    username: currentUser?.username,
    email: currentUser?.email,
  });

  const handleAcceptAvatar = async (avatarPreset: AvatarPreset) => {
    if (isUpdating) {
      return;
    }

    setIsUpdating(true);
    try {
      await updateAvatar({
        avatar: { type: "preset", value: avatarPreset.id },
      });
    } catch (error) {
      console.error("Failed to update avatar", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View className="items-center pb-2 pt-1">
      <AvatarMoreOptions onAccept={handleAcceptAvatar} disabled={isUpdating}>
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
