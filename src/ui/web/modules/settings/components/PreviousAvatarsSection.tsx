import { useMemo, useState } from "react";

import { Plus } from "lucide-react";

import { isPresetAvatarId } from "@/domain/entities/Avatar";
import {
  useCurrentUser,
  useUpdateAvatar,
} from "@/infrastructure/convex/UserApi";
import { getPresetAvatarById } from "@/ui/shared/avatars";
import { Small } from "@/ui/web/components/Typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/web/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/ui/web/components/ui/scroll-area";
import { cn } from "@/ui/web/lib/utils";

type AvatarEntry = {
  type: "custom" | "preset" | "generated";
  value: string;
};

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

export const PreviousAvatarsSection = () => {
  const currentUser = useCurrentUser();
  const updateAvatar = useUpdateAvatar();
  const [isUpdating, setIsUpdating] = useState(false);
  const avatars = (currentUser?.avatars ?? []) as AvatarEntry[];

  const fallbackInitials = useMemo(() => {
    const emailHandle = currentUser?.email?.split("@")[0] ?? "";
    return (
      getInitials(currentUser?.name ?? "") ||
      getInitials(currentUser?.username ?? "") ||
      getInitials(emailHandle) ||
      "?"
    );
  }, [currentUser?.email, currentUser?.name, currentUser?.username]);

  const handleSelectAvatar = async (avatar: AvatarEntry) => {
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

  return (
    <div className="flex flex-col justify-center">
      <div className="flex items-center justify-between h-8">
        <Small className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Previous Avatars
        </Small>
      </div>
      <ScrollArea className={"w-full"}>
        <div className="flex gap-4 overflow-x-auto p-3 md:flex-wrap md:overflow-visible md:pb-0">
          {avatars.map((avatar, index) => {
            const preset =
              avatar.type === "preset" && isPresetAvatarId(avatar.value)
                ? getPresetAvatarById(avatar.value)
                : null;
            const src = preset?.src ?? avatar.value;
            const initials = preset?.initials ?? fallbackInitials;

            return (
              <Avatar
                key={`${avatar.type}-${avatar.value}`}
                size={"lg"}
                className={cn(
                  "size-16! rounded-xl after:content-none cursor-pointer",
                  {
                    "ring-1 ring-primary shadow-[0_0_10px_0_var(--chart-1)]":
                      index === 0,
                    "pointer-events-none opacity-60": isUpdating,
                  },
                )}
                onClick={() => void handleSelectAvatar(avatar)}
              >
                {src ? (
                  <AvatarImage src={src} className={"rounded-xl"} />
                ) : null}
                <AvatarFallback className={"rounded-xl"}>
                  {initials}
                </AvatarFallback>
              </Avatar>
            );
          })}
          <button
            type="button"
            className="grid size-16 place-items-center rounded-xl border border-dashed border-border/70 text-muted-foreground cursor-pointer"
            aria-label="Add custom avatar"
            disabled={isUpdating}
          >
            <Plus className="size-4" />
          </button>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
