import { type LucideIcon, Moon, Sun, Vibrate, Volume2 } from "lucide-react";

import { useTheme } from "@/ui/web/application/providers/ThemeProvider";
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
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export const PreferencesSection = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkTheme = resolvedTheme === "dark";

  const preferences: Preference[] = [
    {
      id: "game-sounds",
      label: "Game Sounds",
      icon: Volume2,
      defaultChecked: true,
    },
    {
      id: "haptic-feedback",
      label: "Haptic Feedback",
      icon: Vibrate,
      defaultChecked: true,
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
          {preferences.map((preference, index) => {
            const Icon = preference.icon;
            const isControlled = typeof preference.checked === "boolean";
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
                      {...(isControlled
                        ? {
                            checked: preference.checked,
                            onCheckedChange: preference.onCheckedChange,
                          }
                        : { defaultChecked: preference.defaultChecked })}
                    />
                  </ItemActions>
                </Item>
                {index < preferences.length - 1 && <ItemSeparator />}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
