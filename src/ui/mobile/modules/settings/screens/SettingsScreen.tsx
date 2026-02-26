import { useEffect } from "react";

import { View } from "react-native";

import { useMobileHeader } from "@/ui/mobile/application/providers/MobileHeaderProvider";
import { AvatarSection } from "@/ui/mobile/modules/settings/components/AvatarSection";
import { DisplayNameSection } from "@/ui/mobile/modules/settings/components/DisplayNameSection";

export const SettingsScreen = () => {
  const { setHeader } = useMobileHeader();

  useEffect(() => {
    setHeader({
      title: "Settings",
    });

    return () => {
      setHeader(null);
    };
  }, [setHeader]);

  return (
    <View className="flex-1 gap-6">
      <AvatarSection />
      <DisplayNameSection />
    </View>
  );
};
