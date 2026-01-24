import { LogOut, Moon, Pencil, Plus, Vibrate, Volume2 } from "lucide-react";

import { PRESET_AVATARS, pickRandomPresetAvatars } from "@/ui/shared/avatars";
import { H3, Small } from "@/ui/web/components/Typography";
import { Avatar, AvatarImage } from "@/ui/web/components/ui/avatar";
import { Button } from "@/ui/web/components/ui/button";
import { Card, CardContent } from "@/ui/web/components/ui/card";
import { Input } from "@/ui/web/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/ui/web/components/ui/item";
import { ScrollArea, ScrollBar } from "@/ui/web/components/ui/scroll-area";
import { Switch } from "@/ui/web/components/ui/switch";
import { cn } from "@/ui/web/lib/utils";

export const SettingsScreen = () => {
  const avatars = pickRandomPresetAvatars(10);
  const preferences = [
    { label: "Game Sounds", icon: Volume2, enabled: true },
    { label: "Haptic Feedback", icon: Vibrate, enabled: true },
    { label: "Dark Theme", icon: Moon, enabled: true },
  ];

  return (
    <section className="mx-auto flex w-full h-full max-w-xl flex-col gap-10 pb-12 pt-10">
      <header className="flex items-center justify-center">
        <H3 className="text-sm font-semibold uppercase tracking-[0.2em] ">
          Settings
        </H3>
      </header>

      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar
            size="lg"
            className="relative size-24! ring-3 ring-black/90 shadow-[0_0_15px_0px_var(--chart-1)] cursor-pointer"
          >
            <AvatarImage src={PRESET_AVATARS[0].src} />
          </Avatar>
          <span className="absolute bottom-1 right-1 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground cursor-pointer">
            <Pencil className="size-3" />
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-4">
        <Small className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Display Name
        </Small>
        <div className="flex items-center gap-3 rounded-4xl border border-border/70 bg-card px-4 py-2">
          <Input
            className="border-none bg-transparent px-0"
            defaultValue="PixelMaster_99"
          />
        </div>
      </div>

      <div className="flex flex-col justify-center gap-2">
        <div className="flex items-center justify-between">
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

      <div className="flex flex-col justify-center gap-4">
        <Small className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Preferences
        </Small>
        <Card className={"py-0"}>
          <CardContent className={"px-0"}>
            {preferences.map((preference, index) => {
              const Icon = preference.icon;
              return (
                <div key={preference.label}>
                  <Item>
                    <ItemMedia
                      variant="icon"
                      className={"bg-secondary p-2 rounded-lg"}
                    >
                      <Icon />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{preference.label}</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <Switch
                        id="switch-focus-mode"
                        defaultChecked={preference.enabled}
                      />
                    </ItemActions>
                  </Item>
                  {index < 2 && <ItemSeparator />}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Button
        variant={"link"}
        className={"text-muted-foreground/60 hover:no-underline"}
      >
        <LogOut className="size-4" />
        Log Out
      </Button>

      <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground/60">
        Version 2.4.0 (Build 8892)
      </p>
    </section>
  );
};
