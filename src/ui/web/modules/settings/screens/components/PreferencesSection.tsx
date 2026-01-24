import {
  type LucideIcon,
  Moon,
  Sun,
  Vibrate,
  VibrateOff,
  Volume2,
  VolumeOff,
} from "lucide-react";

import { useTheme } from "@/ui/web/application/providers/ThemeProvider";
import { useUserPreferences } from "@/ui/web/application/providers/UserPreferencesProvider";
import { Small } from "@/ui/web/components/Typography";
import { Card, CardContent } from "@/ui/web/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/ui/web/components/ui/item";
import { Switch } from "@/ui/web/components/ui/switch";

type Preference = {
  id: string;
  label: string;
  icon: LucideIcon;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export const PreferencesSection = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { preferences, updatePreferences } = useUserPreferences();
  const isDarkTheme = resolvedTheme === "dark";

  const preferenceItems: Preference[] = [
    {
      id: "game-sounds",
      label: "Game Sounds",
      icon: preferences.gameSounds ? Volume2 : VolumeOff,
      checked: preferences.gameSounds,
      onCheckedChange: (checked) => updatePreferences({ gameSounds: checked }),
    },
    {
      id: "haptic-feedback",
      label: "Haptic Feedback",
      icon: preferences.haptics ? Vibrate : VibrateOff,
      checked: preferences.haptics,
      onCheckedChange: (checked) => updatePreferences({ haptics: checked }),
    },
    {
      id: "dark-theme",
      label: "Dark Theme",
      icon: isDarkTheme ? Moon : Sun,
      checked: isDarkTheme,
      onCheckedChange: (checked) => setTheme(checked ? "dark" : "light"),
    },
  ];

  return (
    <div className="flex flex-col justify-center gap-4">
      <Small className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Preferences
      </Small>
      <Card className={"py-0"}>
        <CardContent className={"px-0"}>
          {preferenceItems.map((preference, index) => {
            const Icon = preference.icon;
            return (
              <div key={preference.id}>
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
                      id={`switch-${preference.id}`}
                      checked={preference.checked}
                      onCheckedChange={preference.onCheckedChange}
                    />
                  </ItemActions>
                </Item>
                {index < preferenceItems.length - 1 && <ItemSeparator />}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
