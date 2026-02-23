import { useState } from "react";

import { Plus } from "lucide-react-native";
import { ScrollView, View } from "react-native";

import { Small } from "@/ui/mobile/components/Typography";
import { Icon } from "@/ui/mobile/components/ui/icon";
import {
  type AvatarPreset,
  pickRandomPresetAvatars,
} from "@/ui/shared/avatars";

import { AvatarOptionItem } from "./AvatarOptionItem";
import { AvatarMoreOptions } from "./AvatarMoreOptions";

type AvatarOptionsProps = {
  onChange?: (avatar: AvatarPreset) => void;
};

export const AvatarOptions = ({ onChange }: AvatarOptionsProps) => {
  const [avatarOptions, setAvatarOptions] = useState<AvatarPreset[]>(() =>
    pickRandomPresetAvatars(),
  );
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarPreset>(
    avatarOptions[0],
  );

  const onSelectAvatar = (avatar: AvatarPreset) => {
    setSelectedAvatar(avatar);
    onChange?.(avatar);
  };

  const onAcceptAvatar = (avatar: AvatarPreset) => {
    setAvatarOptions((previousAvatars) => {
      const existingAvatar = previousAvatars.find(
        (currentAvatar) => currentAvatar.id === avatar.id,
      );

      if (existingAvatar) {
        return [
          existingAvatar,
          ...previousAvatars.filter(
            (currentAvatar) => currentAvatar.id !== existingAvatar.id,
          ),
        ];
      }

      return [avatar, ...previousAvatars.slice(1)];
    });
    onSelectAvatar(avatar);
  };

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Small variant="label" className="text-primary/90">
          Select avatar
        </Small>
        <AvatarMoreOptions onAccept={onAcceptAvatar}>
          <Small variant="label" className="text-muted-foreground/70">
            see more
          </Small>
        </AvatarMoreOptions>
      </View>

      <ScrollView
        horizontal
        className="w-full"
        contentContainerClassName="gap-4 pb-2"
        showsHorizontalScrollIndicator={false}
      >
        {avatarOptions.map((avatar) => (
          <AvatarOptionItem
            key={avatar.id}
            avatar={avatar}
            isSelected={avatar.id === selectedAvatar.id}
            onSelect={onSelectAvatar}
          />
        ))}

        <View className="min-w-32 flex-col items-center gap-3 rounded-3xl border-2 border-border/60 bg-card/30 px-5 py-6">
          <View className="size-16 items-center justify-center rounded-full bg-muted/40">
            <Icon as={Plus} size={16} className="text-muted-foreground" />
          </View>
          <Small className="text-xs font-semibold text-muted-foreground">
            CUSTOM
          </Small>
        </View>
      </ScrollView>
    </View>
  );
};
