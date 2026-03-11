import { useState } from "react";

import { isPresetAvatarId, type UserAvatar } from "@/domain/entities/Avatar";
import { getPresetAvatarById } from "@/ui/shared/avatars";
import {
  useCurrentUser,
  useUpdateAvatar,
} from "@/ui/shared/user/hooks/useUser";
import { getFallbackInitials } from "@/ui/shared/user/initials";

export type PreviousAvatarItem = {
  avatar: UserAvatar;
  initials: string;
  isCurrent: boolean;
  key: string;
  src: string | null;
};

export const usePreviousAvatarsSection = () => {
  const currentUser = useCurrentUser();
  const updateAvatar = useUpdateAvatar();
  const [isUpdating, setIsUpdating] = useState(false);

  const fallbackInitials = getFallbackInitials({
    name: currentUser?.name,
    username: currentUser?.username,
    email: currentUser?.email,
  });

  const previousAvatars: PreviousAvatarItem[] = (
    currentUser?.avatars ?? []
  ).map((avatar, index) => {
    const preset =
      avatar.type === "preset" && isPresetAvatarId(avatar.value)
        ? getPresetAvatarById(avatar.value)
        : null;

    return {
      avatar,
      initials: preset?.initials ?? fallbackInitials,
      isCurrent: index === 0,
      key: `${avatar.type}-${avatar.value}`,
      src: preset?.src ?? avatar.value ?? null,
    };
  });

  const onSelectPreviousAvatar = async (avatar: UserAvatar) => {
    if (isUpdating) {
      return;
    }

    setIsUpdating(true);
    try {
      await updateAvatar({ avatar });
    } catch (error) {
      console.error("Failed to update avatar", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    onSelectPreviousAvatar,
    previousAvatars,
  };
};
