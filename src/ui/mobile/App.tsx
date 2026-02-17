import { AppProviders } from "@/ui/mobile/application/providers/AppProviders";
import { MobileSetupScreen } from "@/ui/mobile/modules/setup/MobileSetupScreen";

export const MobileApp = () => {
  return (
    <AppProviders>
      <MobileSetupScreen />
    </AppProviders>
  );
};
