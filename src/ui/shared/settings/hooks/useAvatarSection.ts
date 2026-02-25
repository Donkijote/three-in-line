import { useRef, useState } from "react";

import { isPresetAvatarId } from "@/domain/entities/Avatar";
import { type AvatarPreset, getPresetAvatarById } from "@/ui/shared/avatars";
import {
  useCurrentUser,
  useUpdateAvatar,
} from "@/ui/shared/user/hooks/useUser";
import { getFallbackInitials } from "@/ui/shared/user/initials";

export const useAvatarSection = () => {
  const currentUser = useCurrentUser();
  const updateAvatar = useUpdateAvatar();
  const [isUpdating, setIsUpdating] = useState(false);
  const isUpdatingRef = useRef(false);

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

  const onAcceptAvatar = async (avatarPreset: AvatarPreset) => {
    if (isUpdatingRef.current) {
      return;
    }

    isUpdatingRef.current = true;
    setIsUpdating(true);
    try {
      await updateAvatar({
        avatar: { type: "preset", value: avatarPreset.id },
      });
    } catch (error) {
      console.error("Failed to update avatar", error);
    } finally {
      isUpdatingRef.current = false;
      setIsUpdating(false);
    }
  };

  return {
    avatarSrc,
    fallbackInitials,
    isUpdating,
    onAcceptAvatar,
  };
};
