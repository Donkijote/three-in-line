import { Moon, Vibrate, Volume2 } from "lucide-react";

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

const preferences = [
  { label: "Game Sounds", icon: Volume2, enabled: true },
  { label: "Haptic Feedback", icon: Vibrate, enabled: true },
  { label: "Dark Theme", icon: Moon, enabled: true },
];

export const PreferencesSection = () => (
  <div className="flex flex-col justify-center gap-4">
    <Small className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
      Preferences
    </Small>
    <Card className={"py-0"}>
      <CardContent className={"px-0"}>
        {preferences.map((preference, index) => {
          const Icon = preference.icon;
          return (
            <div key={preference.label}>
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
                    id="switch-focus-mode"
                    defaultChecked={preference.enabled}
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
