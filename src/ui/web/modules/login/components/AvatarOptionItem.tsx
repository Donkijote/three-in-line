import { Activity } from "react";

import { CircleCheck, Plus } from "lucide-react";

import type { AvatarPreset } from "@/ui/shared/avatars";
import { Small } from "@/ui/web/components/Typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/web/components/ui/avatar";
import { cn } from "@/ui/web/lib/utils";

type AvatarOptionItemProps = {
  onSelect: (avatar: AvatarPreset) => void;
  avatar: AvatarPreset;
  isSelected?: boolean;
  isCustom?: boolean;
};

export const AvatarOptionItem = ({
  avatar,
  isCustom,
  isSelected,
  onSelect,
}: AvatarOptionItemProps) => {
  return (
    <button
      key={avatar.id}
      type="button"
      className={cn(
        "cursor-pointer flex min-w-30 flex-col items-center gap-3 rounded-3xl border px-4 py-5 text-left relative",
        {
          "border-primary/70 bg-card/40 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]":
            isSelected,
          "border-border/60 bg-card/30 text-muted-foreground": !isSelected,
        },
      )}
      onClick={() => onSelect(avatar)}
    >
      <div
        className={cn("flex size-16 items-center justify-center rounded-full", {
          "relative bg-linear-to-br from-primary/80 to-primary/40 text-primary-foreground":
            isSelected,
          "bg-muted/40 text-muted-foreground": isCustom,
          "bg-linear-to-br from-muted/60 to-muted/20 text-foreground":
            !isCustom,
        })}
      >
        {isCustom ? (
          <Plus className="size-4" />
        ) : (
          <Avatar size={"lg"} className={"size-16!"}>
            <AvatarImage src={avatar.src} />
            <AvatarFallback>{avatar.initials}</AvatarFallback>
          </Avatar>
        )}
      </div>
      <Activity
        name={"avatar-isSelected"}
        mode={isSelected ? "visible" : "hidden"}
      >
        <CircleCheck
          className={"absolute right-3 top-3 size-3 rounded-full text-primary"}
        />
      </Activity>
      <Small
        className={cn("text-xs font-semibold", {
          "text-foreground/80": isSelected,
          "text-inherit": !isSelected,
        })}
      >
        {avatar.name}
      </Small>
    </button>
  );
};
