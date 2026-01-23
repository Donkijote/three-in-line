import { createFileRoute } from "@tanstack/react-router";

import { HomeScreen } from "@/ui/web/modules/home/screens/HomeScreen";
import { RequireAuth } from "@/ui/web/router/auth";

export const Route = createFileRoute("/")({
  component: HomeRoute,
});

function HomeRoute() {
  return (
    <RequireAuth>
      <HomeScreen />
    </RequireAuth>
  );
}
