import { useState } from "react";

import { X } from "lucide-react";

import { type AvatarPreset, PRESET_AVATARS } from "@/ui/shared/avatars";
import { Small } from "@/ui/web/components/Typography";
import { Button } from "@/ui/web/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/ui/web/components/ui/drawer";
import { ScrollArea } from "@/ui/web/components/ui/scroll-area";
import { useMediaQuery } from "@/ui/web/hooks/useMediaQuery";
import { AvatarOptionItem } from "@/ui/web/modules/login/components/AvatarOptionItem";

type AvatarMoreOptionsProps = {
  onAccept: (avatar: AvatarPreset) => void;
};

export const AvatarMoreOptions = ({ onAccept }: AvatarMoreOptionsProps) => {
  const { isMobile } = useMediaQuery();
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarPreset | null>(
    null,
  );

  const onAcceptAvatar = () => {
    if (!selectedAvatar) return;
    onAccept(selectedAvatar);
    setSelectedAvatar(null);
  };

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger>
        <Small className="cursor-pointer text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
          see more
        </Small>
      </DrawerTrigger>
      <DrawerContent
        className={
          "data-[vaul-drawer-direction=bottom]:h-screen data-[vaul-drawer-direction=bottom]:max-h-[95vh] sm:data-[vaul-drawer-direction=right]:max-w-[70vh] lg:data-[vaul-drawer-direction=right]:w-[70vh] md:data-[vaul-drawer-direction=right]:w-[50vh]"
        }
      >
        <DrawerHeader className={"relative"}>
          <DrawerTitle>Avatars</DrawerTitle>
          <DrawerClose
            className={"absolute right-4 cursor-pointer"}
            onClick={() => setSelectedAvatar(null)}
          >
            <X className={"size-6"} />
          </DrawerClose>
        </DrawerHeader>
        <ScrollArea className={"h-full overflow-y-auto"}>
          <div className={"flex gap-4 justify-center items-center flex-wrap"}>
            {PRESET_AVATARS.map((avatar) => (
              <AvatarOptionItem
                key={avatar.id}
                isSelected={avatar.id === selectedAvatar?.id}
                onSelect={(avatar) => setSelectedAvatar(avatar as AvatarPreset)}
                avatar={avatar}
              />
            ))}
          </div>
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose
            disabled={!selectedAvatar}
            onClick={onAcceptAvatar}
            className={"w-full"}
          >
            <Button
              type="button"
              disabled={!selectedAvatar}
              className={"w-full"}
            >
              Accept
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
