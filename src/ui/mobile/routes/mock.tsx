import { router } from "expo-router";

import { MobileMockScreen } from "@/ui/mobile/modules/setup/MobileMockScreen";
import { RequireAuth } from "@/ui/mobile/router/auth";

export default function MockRoute() {
  return (
    <RequireAuth>
      <MobileMockScreen onGoBack={() => router.back()} />
    </RequireAuth>
  );
}
