import { Plus } from "lucide-react";

import { usePreviousAvatarsSection } from "@/ui/shared/settings/hooks/usePreviousAvatarsSection";
import { Small } from "@/ui/web/components/Typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/web/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/ui/web/components/ui/scroll-area";
import { cn } from "@/ui/web/lib/utils";

export const PreviousAvatarsSection = () => {
  const { isUpdating, onSelectPreviousAvatar, previousAvatars } =
    usePreviousAvatarsSection();

  return (
    <div className="flex flex-col justify-center">
      <div className="flex items-center justify-between h-8">
        <Small variant="label" className="text-muted-foreground">
          Previous Avatars
        </Small>
      </div>
      <ScrollArea className={"w-full"}>
        <div className="flex gap-4 overflow-x-auto p-3 md:flex-wrap md:overflow-visible">
          {previousAvatars.map((item) => {
            return (
              <Avatar
                key={item.key}
                size={"lg"}
                className={cn(
                  "size-16! rounded-xl after:content-none cursor-pointer",
                  {
                    "ring-1 ring-primary shadow-[0_0_10px_0_var(--chart-1)]":
                      item.isCurrent,
                    "pointer-events-none opacity-60": isUpdating,
                  },
                )}
                onClick={() => void onSelectPreviousAvatar(item.avatar)}
              >
                {item.src ? (
                  <AvatarImage src={item.src} className={"rounded-xl"} />
                ) : null}
                <AvatarFallback className={"rounded-xl"}>
                  {item.initials}
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
