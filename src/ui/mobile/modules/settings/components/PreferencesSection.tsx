import { Moon, Sun, Vibrate, Volume2 } from "lucide-react-native";
import { View } from "react-native";

import { useTheme } from "@/ui/mobile/application/providers/ThemeProvider";
import { Small } from "@/ui/mobile/components/Typography";
import { Card, CardContent } from "@/ui/mobile/components/ui/card";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { Separator } from "@/ui/mobile/components/ui/separator";
import { Switch } from "@/ui/mobile/components/ui/switch";
import { Text } from "@/ui/mobile/components/ui/text";

type PreferenceItem = {
  id: string;
  icon: typeof Moon;
  label: string;
  value: boolean;
};

export const PreferencesSection = () => {
  const { isDark } = useTheme();

  const preferenceItems: PreferenceItem[] = [
    {
      id: "game-sounds",
      icon: Volume2,
      label: "Game Sounds",
      value: true,
    },
    {
      id: "haptic-feedback",
      icon: Vibrate,
      label: "Haptic Feedback",
      value: true,
    },
    {
      id: "dark-theme",
      icon: isDark ? Moon : Sun,
      label: "Dark Theme",
      value: isDark,
    },
  ];

  return (
    <View className="gap-1">
      <Small variant="label" className="h-8 text-muted-foreground">
        Preferences
      </Small>
      <Card className="py-0">
        <CardContent className="my-1 gap-0 px-0">
          {preferenceItems.map((preference, index) => {
            const IconComponent = preference.icon;

            return (
              <View key={preference.id}>
                <View className="flex-row items-center gap-3 px-4 py-4">
                  <View className="rounded-lg bg-secondary p-2">
                    <Icon
                      as={IconComponent}
                      className="text-foreground"
                      size={18}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-foreground">
                      {preference.label}
                    </Text>
                  </View>
                  <Switch
                    checked={preference.value}
                    onCheckedChange={() => undefined}
                  />
                </View>
                {index < preferenceItems.length - 1 ? <Separator /> : null}
              </View>
            );
          })}
        </CardContent>
      </Card>
    </View>
  );
};
