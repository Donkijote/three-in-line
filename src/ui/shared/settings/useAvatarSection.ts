import { useRef, useState } from "react";

import type { UserAvatar } from "@/domain/entities/Avatar";
import { isPresetAvatarId } from "@/domain/entities/Avatar";
import type { User } from "@/domain/entities/User";
import { type AvatarPreset, getPresetAvatarById } from "@/ui/shared/avatars";
import { getFallbackInitials } from "@/ui/shared/user/initials";

type UseAvatarSectionParams = {
  currentUser?: User | null;
  updateAvatar: (input: { avatar: UserAvatar }) => Promise<unknown>;
};

export const useAvatarSection = ({
  currentUser,
  updateAvatar,
}: UseAvatarSectionParams) => {
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
