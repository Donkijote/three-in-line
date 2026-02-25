import { router } from "expo-router";

import { MockScreen } from "@/ui/mobile/modules/setup/MockScreen";
import { RequireAuth } from "@/ui/mobile/router/auth";

export default function MockRoute() {
  return (
    <RequireAuth>
      <MockScreen onGoBack={() => router.back()} />
    </RequireAuth>
  );
}
