import { LoginScreen } from "@/ui/mobile/modules/login/screens/LoginScreen";
import { RequireUnAuth } from "@/ui/mobile/router/auth";

export default function LoginRoute() {
  return (
    <RequireUnAuth>
      <LoginScreen />
    </RequireUnAuth>
  );
}
