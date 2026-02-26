import { Plus } from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";

import { Small } from "@/ui/mobile/components/Typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/mobile/components/ui/avatar";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { Text } from "@/ui/mobile/components/ui/text";
import { cn } from "@/ui/mobile/lib/utils";
import { usePreviousAvatarsSection } from "@/ui/shared/settings/hooks/usePreviousAvatarsSection";

export const PreviousAvatarsSection = () => {
  const { isUpdating, onSelectPreviousAvatar, previousAvatars } =
    usePreviousAvatarsSection();

  return (
    <View className="gap-2">
      <View className="h-8 flex-row items-center justify-between">
        <Small variant="label" className="text-muted-foreground">
          Previous Avatars
        </Small>
      </View>

      <ScrollView
        horizontal
        className="w-full"
        contentContainerClassName="gap-3 px-1 pb-2"
        showsHorizontalScrollIndicator={false}
      >
        {previousAvatars.map((item) => (
          <Pressable
            key={item.key}
            onPress={() => void onSelectPreviousAvatar(item.avatar)}
            disabled={isUpdating}
          >
            <Avatar
              alt={item.initials}
              className={cn("size-16 rounded-xl border border-border/70", {
                "border-primary": item.isCurrent,
                "opacity-60": isUpdating,
              })}
            >
              {item.src ? (
                <AvatarImage
                  source={{ uri: item.src }}
                  className="rounded-xl"
                />
              ) : null}
              <AvatarFallback className="rounded-xl">
                <Text className="font-semibold text-foreground">
                  {item.initials}
                </Text>
              </AvatarFallback>
            </Avatar>
          </Pressable>
        ))}

        <Pressable
          disabled={isUpdating}
          accessibilityLabel="Add custom avatar"
          className={cn(
            "size-16 items-center justify-center rounded-xl border border-dashed border-border/70",
            {
              "opacity-60": isUpdating,
            },
          )}
        >
          <Icon as={Plus} size={16} className="text-muted-foreground" />
        </Pressable>
      </ScrollView>
    </View>
  );
};
