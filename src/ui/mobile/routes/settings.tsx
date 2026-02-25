import { SettingsScreen } from "@/ui/mobile/modules/settings/screens/SettingsScreen";
import { RequireAuth } from "@/ui/mobile/router/auth";

export default function SettingsRoute() {
  return (
    <RequireAuth>
      <SettingsScreen />
    </RequireAuth>
  );
}
