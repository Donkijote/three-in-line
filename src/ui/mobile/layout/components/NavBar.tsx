import { BlurView } from "expo-blur";
import { router, usePathname } from "expo-router";
import { Gamepad2, Home, Settings } from "lucide-react-native";
import { Platform, Pressable, View } from "react-native";

import { useTheme } from "@/ui/mobile/application/providers/ThemeProvider";
import { Icon } from "@/ui/mobile/components/ui/icon";
import { Text } from "@/ui/mobile/components/ui/text";
import { cn } from "@/ui/mobile/lib/utils";

type NavItem = {
  icon: typeof Home;
  label: string;
  path: string;
};

const navItems: NavItem[] = [
  {
    icon: Home,
    label: "Home",
    path: "/",
  },
  {
    icon: Gamepad2,
    label: "Play",
    path: "/mock",
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/mock",
  },
];

type NavItemsContentProps = {
  pathname: string;
};

const NavItemsContent = ({ pathname }: NavItemsContentProps) => {
  return navItems.map((item) => {
    const isActive = pathname === item.path;
    return (
      <Pressable
        key={item.label}
        className="flex-1 items-center"
        onPress={() => router.replace(item.path)}
      >
        <View className="items-center gap-0.5">
          <View
            className={cn("h-9 w-9 items-center justify-center", {
              "text-primary": isActive,
              "text-muted-foreground": !isActive,
            })}
          >
            <Icon
              as={item.icon}
              className={cn("size-5", {
                "text-primary": isActive,
                "text-muted-foreground": !isActive,
              })}
            />
          </View>
          <Text
            className={cn(
              "text-[10px] font-semibold uppercase tracking-[1.5px]",
              {
                "text-primary": isActive,
                "text-muted-foreground": !isActive,
              },
            )}
          >
            {item.label}
          </Text>
        </View>
      </Pressable>
    );
  });
};

export const NavBar = () => {
  const { isDark } = useTheme();
  const pathname = usePathname();
  const isIOS = Platform.OS === "ios";

  return (
    <View className="absolute inset-x-0 bottom-12 z-40 flex justify-center px-4">
      {isIOS ? (
        <View
          className={cn(
            "mx-auto w-full max-w-xs overflow-hidden rounded-full border",
            {
              "border-border/60": !isDark,
              "border-border": isDark,
            },
          )}
        >
          <BlurView
            intensity={25}
            tint="systemUltraThinMaterialLight"
            className="absolute inset-0"
          />
          <View className="flex-row items-center justify-between px-4 py-2">
            <NavItemsContent pathname={pathname} />
          </View>
        </View>
      ) : (
        <View className="mx-auto flex w-full max-w-xs flex-row items-center justify-between rounded-full border border-border/60 bg-card/80 px-4 py-2 shadow-sm shadow-black/5">
          <NavItemsContent pathname={pathname} />
        </View>
      )}
    </View>
  );
};
