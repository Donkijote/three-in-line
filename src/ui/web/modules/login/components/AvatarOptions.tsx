import { Activity, type Dispatch, type SetStateAction, useState } from "react";

import { CircleCheck, Plus } from "lucide-react";

import { Small } from "@/ui/web/components/Typography";
import { cn } from "@/ui/web/lib/utils";

type AvatarOption = {
  id: string;
  label: string;
  initials: string;
};

const avatarOptions: AvatarOption[] = [
  { id: "bot-01", label: "Bot 01", initials: "B1" },
  { id: "unit-09", label: "Unit 09", initials: "U9" },
  { id: "x-ray", label: "X-Ray", initials: "XR" },
  { id: "pixel", label: "Pixel", initials: "PX" },
  { id: "al", label: "AL", initials: "AL" },
];

const customAvatarOptions: AvatarOption = {
  id: "custom",
  label: "Custom",
  initials: "",
};

export const AvatarOptions = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarOption>(
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
        <AvatarOptionItem
          avatar={customAvatarOptions}
          onSelect={setSelectedAvatar}
          isCustom={true}
        />
      </div>
    </div>
  );
};

type AvatarOptionItemProps = {
  onSelect: Dispatch<SetStateAction<AvatarOption>>;
  avatar: AvatarOption;
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
        isSelected
          ? "border-primary/70 bg-card/40 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "border-border/60 bg-card/30 text-muted-foreground",
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
          <span className="text-sm font-semibold">{avatar.initials}</span>
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
        className={cn(
          "text-xs font-semibold",
          isSelected ? "text-foreground/80" : "text-inherit",
        )}
      >
        {avatar.label}
      </Small>
    </button>
  );
};
