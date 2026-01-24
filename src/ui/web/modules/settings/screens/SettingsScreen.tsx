import { H3 } from "@/ui/web/components/Typography";
import { AvatarSection } from "@/ui/web/modules/settings/components/AvatarSection";
import { DisplayNameSection } from "@/ui/web/modules/settings/components/DisplayNameSection";
import { LogoutButton } from "@/ui/web/modules/settings/components/LogoutButton";
import { PreferencesSection } from "@/ui/web/modules/settings/components/PreferencesSection";
import { PreviousAvatarsSection } from "@/ui/web/modules/settings/components/PreviousAvatarsSection";
import { VersionInfo } from "@/ui/web/modules/settings/components/VersionInfo";

export const SettingsScreen = () => {
  return (
    <section className="mx-auto flex w-full h-full max-w-xl flex-col gap-10 pb-12 pt-10">
      <header className="flex items-center justify-center">
        <H3 className="text-sm font-semibold uppercase tracking-[0.2em] ">
          Settings
        </H3>
      </header>

      <AvatarSection />

      <DisplayNameSection />

      <PreviousAvatarsSection />

      <PreferencesSection />

      <LogoutButton />

      <VersionInfo />
    </section>
  );
};
