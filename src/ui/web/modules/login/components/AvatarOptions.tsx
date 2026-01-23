import { useState } from "react";

import { Plus } from "lucide-react";

import {
  type AvatarPreset,
  pickRandomPresetAvatars,
} from "@/ui/shared/avatars";
import { Small } from "@/ui/web/components/Typography";
import { ScrollArea, ScrollBar } from "@/ui/web/components/ui/scroll-area";
import { AvatarMoreOptions } from "@/ui/web/modules/login/components/AvatarMoreOptions";

import { AvatarOptionItem } from "./AvatarOptionItem";

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
        <AvatarMoreOptions onAccept={setSelectedAvatar} />
      </div>

      <ScrollArea className="w-full rounded-md">
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
            <Small className={"text-xs font-semibold text-inherit"}>
              CUSTOM
            </Small>
          </button>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
