import { CircleCheck, Plus } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { Small } from "@/ui/mobile/components/Typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/mobile/components/ui/avatar";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { Text } from "@/ui/mobile/components/ui/text";
import { Visibility } from "@/ui/mobile/layout/components/Visibility";
import { cn } from "@/ui/mobile/lib/utils";
import type { AvatarPreset } from "@/ui/shared/avatars";

type AvatarOptionItemProps = {
  avatar: AvatarPreset;
  isSelected: boolean;
  onSelect: (avatar: AvatarPreset) => void;
  isCustom?: boolean;
};

export const AvatarOptionItem = ({
  avatar,
  isSelected,
  onSelect,
  isCustom = false,
}: AvatarOptionItemProps) => {
  const avatarContainerClassName = cn(
    "size-16 items-center justify-center rounded-full",
    {
      "bg-primary/25": isSelected,
      "bg-muted/40": !isSelected && isCustom,
      "bg-muted/30": !isSelected && !isCustom,
    },
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`Select avatar ${avatar.name}`}
      className={cn(
        "relative min-w-32 flex-col items-center gap-3 rounded-3xl border-2 px-5 py-6",
        isSelected
          ? "border-primary/70 bg-card/40"
          : "border-border/60 bg-card/30",
      )}
      onPress={() => onSelect(avatar)}
    >
      <View className={avatarContainerClassName}>
        {isCustom ? (
          <Icon as={Plus} size={16} className="text-muted-foreground" />
        ) : (
          <Avatar alt={avatar.name} className="size-16">
            <AvatarImage source={{ uri: avatar.src }} />
            <AvatarFallback className="bg-muted">
              <Text className="text-lg font-semibold text-foreground">
                {avatar.initials}
              </Text>
            </AvatarFallback>
          </Avatar>
        )}
      </View>

      <Visibility visible={isSelected}>
        <View className="absolute right-3 top-3 z-10">
          <Icon
            as={CircleCheck}
            size={16}
            className="rounded-full bg-background text-primary"
            accessibilityElementsHidden
            importantForAccessibility="no"
          />
        </View>
      </Visibility>

      <Small
        className={cn("text-xs font-semibold", {
          "text-foreground/90": isSelected,
          "text-muted-foreground": !isSelected,
        })}
      >
        {avatar.name}
      </Small>
    </Pressable>
  );
};
