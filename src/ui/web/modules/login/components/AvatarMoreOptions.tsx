import { X } from "lucide-react";

import { PRESET_AVATARS } from "@/ui/shared/avatars";
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
import { AvatarOptionItem } from "@/ui/web/modules/login/components/AvatarOptionItem";

export const AvatarMoreOptions = () => {
  return (
    <Drawer direction={"bottom"}>
      <DrawerTrigger>
        <Small className="cursor-pointer text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
          see more
        </Small>
      </DrawerTrigger>
      <DrawerContent
        className={
          "data-[vaul-drawer-direction=bottom]:h-screen data-[vaul-drawer-direction=bottom]:max-h-[95vh] sm:data-[vaul-drawer-direction=right]:max-w-[70vh] data-[vaul-drawer-direction=right]:w-[70vh]"
        }
      >
        <DrawerHeader className={"relative"}>
          <DrawerTitle>Avatars</DrawerTitle>
          <DrawerClose className={"absolute right-4 cursor-pointer"}>
            <X className={"size-6"} />
          </DrawerClose>
        </DrawerHeader>
        <ScrollArea className={"h-full overflow-y-auto"}>
          <div className={"flex gap-4 justify-center items-center flex-wrap"}>
            {PRESET_AVATARS.map((avatar) => (
              <AvatarOptionItem
                key={avatar.id}
                onSelect={() => null}
                avatar={avatar}
              />
            ))}
          </div>
        </ScrollArea>
        <DrawerFooter>
          <Button>Accept</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
