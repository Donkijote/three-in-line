import { Pencil } from "lucide-react";

import { isPresetAvatarId } from "@/domain/entities/Avatar";
import { useCurrentUser } from "@/infrastructure/convex/UserApi";
import { getPresetAvatarById } from "@/ui/shared/avatars";
import { AvatarMoreOptions } from "@/ui/web/components/AvatarMoreOptions";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/web/components/ui/avatar";

const getInitials = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return trimmed.slice(0, 2).toUpperCase();
};

export const AvatarSection = () => {
  const currentUser = useCurrentUser();
  const avatar = currentUser?.avatar;
  const avatarSrc =
    avatar?.type === "preset" && isPresetAvatarId(avatar.value)
      ? getPresetAvatarById(avatar.value).src
      : (avatar?.value ?? currentUser?.image ?? null);

  const emailHandle = currentUser?.email?.split("@")[0] ?? "";
  const initials =
    getInitials(currentUser?.name ?? "") ||
    getInitials(currentUser?.username ?? "") ||
    getInitials(emailHandle) ||
    "?";

  return (
    <div className="flex flex-col items-center gap-4">
      <AvatarMoreOptions onAccept={() => null}>
        <div className="relative">
          <Avatar
            size="lg"
            className="relative size-24! ring-3 ring-black/90 shadow-[0_0_15px_0px_var(--chart-1)] cursor-pointer"
          >
            {avatarSrc && <AvatarImage src={avatarSrc} alt={initials} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="absolute bottom-1 right-1 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground cursor-pointer">
            <Pencil className="size-3" />
          </span>
        </div>
      </AvatarMoreOptions>
    </div>
  );
};
