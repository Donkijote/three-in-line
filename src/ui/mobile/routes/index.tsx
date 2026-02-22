import { router } from "expo-router";

import { MobileSetupScreen } from "@/ui/mobile/modules/setup/MobileSetupScreen";
import { RequireAuth } from "@/ui/mobile/router/auth";

export default function SetupRoute() {
  return (
    <RequireAuth>
      <MobileSetupScreen onOpenMock={() => router.push("/mock")} />
    </RequireAuth>
  );
}
