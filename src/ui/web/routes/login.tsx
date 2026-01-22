import { createFileRoute } from "@tanstack/react-router";

import { LoginScreen } from "@/ui/web/modules/login/screens/LoginScreen";
import { RequireUnAuth } from "@/ui/web/router/auth";

export const Route = createFileRoute("/login")({
  component: LoginRoute,
});

function LoginRoute() {
  return (
    <RequireUnAuth>
      <LoginScreen />
    </RequireUnAuth>
  );
}
