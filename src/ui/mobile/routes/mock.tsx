import { router } from "expo-router";

import { MobileMockScreen } from "@/ui/mobile/modules/setup/MobileMockScreen";

export default function MockRoute() {
  return <MobileMockScreen onGoBack={() => router.back()} />;
}
