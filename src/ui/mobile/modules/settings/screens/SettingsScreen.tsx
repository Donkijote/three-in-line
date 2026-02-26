import { useEffect } from "react";

import { View } from "react-native";

import { useMobileHeader } from "@/ui/mobile/application/providers/MobileHeaderProvider";
import { AvatarSection } from "@/ui/mobile/modules/settings/components/AvatarSection";
import { DisplayNameSection } from "@/ui/mobile/modules/settings/components/DisplayNameSection";
import { LogoutSection } from "@/ui/mobile/modules/settings/components/LogoutSection";
import { PreferencesSection } from "@/ui/mobile/modules/settings/components/PreferencesSection";
import { PreviousAvatarsSection } from "@/ui/mobile/modules/settings/components/PreviousAvatarsSection";
import { VersionInfo } from "@/ui/mobile/modules/settings/components/VersionInfo";

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
    <View className="flex-1 gap-10">
      <AvatarSection />
      <DisplayNameSection />
      <PreviousAvatarsSection />
      <PreferencesSection />
      <LogoutSection />
      <VersionInfo />
    </View>
  );
};
