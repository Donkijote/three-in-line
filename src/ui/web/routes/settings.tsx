import { createFileRoute } from "@tanstack/react-router";

import { SettingsScreen } from "@/ui/web/modules/settings/screens/SettingsScreen";
import { RequireAuth } from "@/ui/web/router/auth";

export const Route = createFileRoute("/settings")({
  component: SettingsRoute,
});

function SettingsRoute() {
  return (
    <RequireAuth>
      <SettingsScreen />
    </RequireAuth>
  );
}
