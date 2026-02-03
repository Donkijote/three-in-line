import { Header } from "@/ui/web/components/Header";
import { AvatarSection } from "@/ui/web/modules/settings/components/AvatarSection";
import { DisplayNameSection } from "@/ui/web/modules/settings/components/DisplayNameSection";
import { LogoutButton } from "@/ui/web/modules/settings/components/LogoutButton";
import { PreferencesSection } from "@/ui/web/modules/settings/components/PreferencesSection";
import { PreviousAvatarsSection } from "@/ui/web/modules/settings/components/PreviousAvatarsSection";
import { VersionInfo } from "@/ui/web/modules/settings/components/VersionInfo";

export const SettingsScreen = () => {
  return (
    <section className="mx-auto flex w-full h-full max-w-xl flex-col gap-10 pb-12">
      <Header title="Settings" />

      <AvatarSection />

      <DisplayNameSection />

      <PreviousAvatarsSection />

      <PreferencesSection />

      <LogoutButton />

      <VersionInfo />
    </section>
  );
};
