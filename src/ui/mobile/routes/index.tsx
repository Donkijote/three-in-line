import { HomeScreen } from "@/ui/mobile/modules/home/screens/HomeScreen";
import { RequireAuth } from "@/ui/mobile/router/auth";

export default function HomeRoute() {
  return (
    <RequireAuth>
      <HomeScreen />
    </RequireAuth>
  );
}
