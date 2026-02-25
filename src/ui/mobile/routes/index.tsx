import { router } from "expo-router";

import { SetupScreen } from "@/ui/mobile/modules/setup/SetupScreen";
import { RequireAuth } from "@/ui/mobile/router/auth";

export default function SetupRoute() {
  return (
    <RequireAuth>
      <SetupScreen onOpenMock={() => router.push("/mock")} />
    </RequireAuth>
  );
}
