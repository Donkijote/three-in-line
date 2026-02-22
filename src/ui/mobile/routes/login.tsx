import { MobileLoginScreen } from "@/ui/mobile/modules/login/MobileLoginScreen";
import { RequireUnAuth } from "@/ui/mobile/router/auth";

export default function LoginRoute() {
  return (
    <RequireUnAuth>
      <MobileLoginScreen />
    </RequireUnAuth>
  );
}
