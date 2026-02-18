import { router } from "expo-router";

import { MobileSetupScreen } from "@/ui/mobile/modules/setup/MobileSetupScreen";

export default function SetupRoute() {
  return <MobileSetupScreen onOpenMock={() => router.push("/mock")} />;
}
