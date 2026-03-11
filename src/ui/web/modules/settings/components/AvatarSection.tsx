import { Loader, Pencil } from "lucide-react";

import { useAvatarSection } from "@/ui/shared/settings/hooks/useAvatarSection";
import { AvatarMoreOptions } from "@/ui/web/components/AvatarMoreOptions";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/ui/web/components/ui/avatar";
import { cn } from "@/ui/web/lib/utils";

export const AvatarSection = () => {
  const { avatarSrc, fallbackInitials, isUpdating, onAcceptAvatar } =
    useAvatarSection();

  return (
    <div className="flex flex-col items-center gap-4">
      <AvatarMoreOptions onAccept={onAcceptAvatar}>
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
