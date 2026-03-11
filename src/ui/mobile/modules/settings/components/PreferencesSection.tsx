import {
  Moon,
  Sun,
  Vibrate,
  VibrateOff,
  Volume2,
  VolumeOff,
} from "lucide-react-native";
import { View } from "react-native";

import { useTheme } from "@/ui/mobile/application/providers/ThemeProvider";
import { useUserPreferences } from "@/ui/mobile/application/providers/UserPreferencesProvider";
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
  onCheckedChange: (checked: boolean) => void;
  checked: boolean;
};

export const PreferencesSection = () => {
  const { isDark, setTheme } = useTheme();
  const { preferences, updatePreferences } = useUserPreferences();

  const preferenceItems: PreferenceItem[] = [
    {
      id: "game-sounds",
      icon: preferences.gameSounds ? Volume2 : VolumeOff,
      label: "Game Sounds",
      checked: preferences.gameSounds,
      onCheckedChange: (checked) => updatePreferences({ gameSounds: checked }),
    },
    {
      id: "haptic-feedback",
      icon: preferences.haptics ? Vibrate : VibrateOff,
      label: "Haptic Feedback",
      checked: preferences.haptics,
      onCheckedChange: (checked) => updatePreferences({ haptics: checked }),
    },
    {
      id: "dark-theme",
      icon: isDark ? Moon : Sun,
      label: "Dark Theme",
      checked: isDark,
      onCheckedChange: (checked) => setTheme(checked ? "dark" : "light"),
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
                    checked={preference.checked}
                    onCheckedChange={preference.onCheckedChange}
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
