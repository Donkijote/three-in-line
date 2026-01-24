import { Plus } from "lucide-react";

import { pickRandomPresetAvatars } from "@/ui/shared/avatars";
import { H3, Small } from "@/ui/web/components/Typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/web/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/ui/web/components/ui/scroll-area";
import { cn } from "@/ui/web/lib/utils";
import { AvatarSection } from "@/ui/web/modules/settings/components/AvatarSection";
import { DisplayNameSection } from "@/ui/web/modules/settings/components/DisplayNameSection";
import { LogoutButton } from "@/ui/web/modules/settings/components/LogoutButton";
import { PreferencesSection } from "@/ui/web/modules/settings/components/PreferencesSection";
import { VersionInfo } from "@/ui/web/modules/settings/components/VersionInfo";

export const SettingsScreen = () => {
  const avatars = pickRandomPresetAvatars(10);

  return (
    <section className="mx-auto flex w-full h-full max-w-xl flex-col gap-10 pb-12 pt-10">
      <header className="flex items-center justify-center">
        <H3 className="text-sm font-semibold uppercase tracking-[0.2em] ">
          Settings
        </H3>
      </header>

      <AvatarSection />

      <DisplayNameSection />

      <div className="flex flex-col justify-center">
        <div className="flex items-center justify-between h-8">
          <Small className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Choose Avatar
          </Small>
          <Small className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            View All
          </Small>
        </div>
        <ScrollArea className={"w-full"}>
          <div className="flex gap-4 overflow-x-auto p-3 md:flex-wrap md:overflow-visible md:pb-0">
            {avatars.map((avatar, index) => (
              <Avatar
                key={avatar.id}
                size={"lg"}
                className={cn(
                  "size-16! rounded-xl after:content-none cursor-pointer",
                  {
                    "ring-1 ring-primary shadow-[0_0_10px_0_var(--chart-1)]":
                      index === 0,
                  },
                )}
              >
                <AvatarImage src={avatar.src} className={"rounded-xl"} />
                <AvatarFallback className={"rounded-xl"}>
                  {avatar.initials}
                </AvatarFallback>
              </Avatar>
            ))}
            <button
              type="button"
              className="grid size-16 place-items-center rounded-xl border border-dashed border-border/70 text-muted-foreground cursor-pointer"
              aria-label="Add custom avatar"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <PreferencesSection />

      <LogoutButton />

      <VersionInfo />
    </section>
  );
};
