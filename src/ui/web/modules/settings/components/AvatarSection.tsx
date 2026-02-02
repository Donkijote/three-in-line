import { useMemo, useState } from "react";

import { Loader, Pencil } from "lucide-react";

import { isPresetAvatarId } from "@/domain/entities/Avatar";
import { type AvatarPreset, getPresetAvatarById } from "@/ui/shared/avatars";
import { AvatarMoreOptions } from "@/ui/web/components/AvatarMoreOptions";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/ui/web/components/ui/avatar";
import { useCurrentUser, useUpdateAvatar } from "@/ui/web/hooks/useUser";
import { cn, getFallbackInitials } from "@/ui/web/lib/utils";

export const AvatarSection = () => {
  const currentUser = useCurrentUser();
  const updateAvatar = useUpdateAvatar();

  const [isUpdating, setIsUpdating] = useState(false);

  const avatar = currentUser?.avatar;
  const avatarSrc =
    avatar?.type === "preset" && isPresetAvatarId(avatar.value)
      ? getPresetAvatarById(avatar.value).src
      : (avatar?.value ?? currentUser?.image ?? null);

  const fallbackInitials = useMemo(
    () =>
      getFallbackInitials({
        name: currentUser?.name,
        username: currentUser?.username,
        email: currentUser?.email,
      }),
    [currentUser?.email, currentUser?.name, currentUser?.username],
  );

  const handleAccept = async (avatarPreset: AvatarPreset) => {
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
    <div className="flex flex-col items-center gap-4">
      <AvatarMoreOptions onAccept={handleAccept}>
        <div className="relative">
          <Avatar
            size="lg"
            className={cn(
              "relative size-24! ring-3 ring-black/90 shadow-[0_0_15px_0px_var(--chart-1)] cursor-pointer",
              isUpdating && "pointer-events-none opacity-80",
            )}
          >
            {avatarSrc && (
              <AvatarImage src={avatarSrc} alt={fallbackInitials} />
            )}
            <AvatarFallback>{fallbackInitials}</AvatarFallback>
            {isUpdating && (
              <span className="absolute inset-0 grid place-items-center rounded-full bg-black/40 text-white">
                <Loader className="size-5 animate-spin" />
              </span>
            )}
            <AvatarBadge className="cursor-pointer size-6!">
              <Pencil className="size-3!" />
            </AvatarBadge>
          </Avatar>
        </div>
      </AvatarMoreOptions>
    </div>
  );
};
