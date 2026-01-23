import { Activity, type Dispatch, type SetStateAction, useState } from "react";

import { CircleCheck, Plus } from "lucide-react";

import {
  type AvatarPreset,
  pickRandomPresetAvatars,
} from "@/ui/shared/avatars";
import { Small } from "@/ui/web/components/Typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/web/components/ui/avatar";
import { cn } from "@/ui/web/lib/utils";

const avatarOptions = pickRandomPresetAvatars();

export const AvatarOptions = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarPreset>(
    avatarOptions[0],
  );

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="flex items-center justify-between">
        <Small className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
          Select avatar
        </Small>
        <Small className="text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
          Scroll for more
        </Small>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 md:flex-wrap md:overflow-visible md:pb-0">
        {avatarOptions.map((avatar) => (
          <AvatarOptionItem
            key={avatar.id}
            isSelected={avatar.id === selectedAvatar.id}
            avatar={avatar}
            onSelect={setSelectedAvatar}
          />
        ))}
        <button
          type="button"
          className={
            "cursor-pointer flex min-w-30 flex-col items-center gap-3 rounded-3xl border px-4 py-5 text-left relative border-border/60 bg-card/30 text-muted-foreground"
          }
        >
          <div
            className={
              "flex size-16 items-center justify-center rounded-full bg-muted/40 text-muted-foreground"
            }
          >
            <Plus className="size-4" />
          </div>
          <Small className={"text-xs font-semibold text-inherit"}>CUSTOM</Small>
        </button>
      </div>
    </div>
  );
};

type AvatarOptionItemProps = {
  onSelect: Dispatch<SetStateAction<AvatarPreset>>;
  avatar: AvatarPreset;
  isSelected?: boolean;
  isCustom?: boolean;
};

const AvatarOptionItem = ({
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
