import { Unauthenticated } from "convex/react";

import { createFileRoute } from "@tanstack/react-router";

import { LoginScreen } from "@/ui/web/modules/login/screens/LoginScreen";

export const Route = createFileRoute("/login")({
  component: LoginRoute,
});

function LoginRoute() {
  return (
    <Unauthenticated>
      <LoginScreen />
    </Unauthenticated>
  );
}
