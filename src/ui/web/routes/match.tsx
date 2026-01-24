import { createFileRoute } from "@tanstack/react-router";

import { MatchScreen } from "@/ui/web/modules/match/screens/MatchScreen";
import { RequireAuth } from "@/ui/web/router/auth";

export const Route = createFileRoute("/match")({
  component: MatchRoute,
});

function MatchRoute() {
  return (
    <RequireAuth>
      <MatchScreen />
    </RequireAuth>
  );
}
