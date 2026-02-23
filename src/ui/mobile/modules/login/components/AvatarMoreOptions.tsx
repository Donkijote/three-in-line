import { type PropsWithChildren, useState } from "react";

import { X } from "lucide-react-native";
import { useWindowDimensions, View } from "react-native";

import { Small } from "@/ui/mobile/components/Typography";
import { Button } from "@/ui/mobile/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/ui/mobile/components/ui/drawer";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { ScrollArea } from "@/ui/mobile/components/ui/scroll-area";
import { Text } from "@/ui/mobile/components/ui/text";
import { type AvatarPreset, PRESET_AVATARS } from "@/ui/shared/avatars";

import { AvatarOptionItem } from "./AvatarOptionItem";

type AvatarMoreOptionsProps = {
  onAccept: (avatar: AvatarPreset) => void;
};

export const AvatarMoreOptions = ({
  onAccept,
  children,
}: PropsWithChildren<AvatarMoreOptionsProps>) => {
  const { width } = useWindowDimensions();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarPreset | null>(
    null,
  );
  const drawerDirection = width >= 768 ? "right" : "bottom";

  const onAcceptAvatar = () => {
    if (!selectedAvatar) {
      return;
    }

    onAccept(selectedAvatar);
    setIsOpen(false);
    setSelectedAvatar(null);
  };

  return (
    <Drawer
      direction={drawerDirection}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent className="h-full max-h-[92%]">
        <DrawerHeader className="relative items-center pb-3">
          <DrawerTitle className="text-center text-lg">Avatars</DrawerTitle>
          <DrawerClose
            className="absolute right-1 top-0 h-10 w-10 items-center justify-center rounded-full"
            onPress={() => {
              setSelectedAvatar(null);
              setIsOpen(false);
            }}
            accessibilityLabel="Close avatar list"
          >
            <Icon as={X} size={24} className="text-foreground" />
          </DrawerClose>
        </DrawerHeader>

        <ScrollArea className="flex-1">
          <View className="flex-row flex-wrap justify-center gap-4 px-1 pb-4">
            {PRESET_AVATARS.map((avatar) => (
              <AvatarOptionItem
                key={avatar.id}
                avatar={avatar}
                isSelected={avatar.id === selectedAvatar?.id}
                onSelect={setSelectedAvatar}
              />
            ))}
          </View>
        </ScrollArea>

        <DrawerFooter className="pt-3">
          <Button
            disabled={!selectedAvatar}
            onPress={onAcceptAvatar}
            className="h-12 w-full rounded-full bg-primary active:bg-primary/90"
          >
            <Text className="font-semibold text-primary-foreground uppercase tracking-[1.2px]">
              Accept
            </Text>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
