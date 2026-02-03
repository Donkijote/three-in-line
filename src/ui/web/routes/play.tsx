import { createFileRoute } from "@tanstack/react-router";

import { PlayScreen } from "@/ui/web/modules/play/screens/PlayScreen";
import { RequireAuth } from "@/ui/web/router/auth";

export const Route = createFileRoute("/play")({
  component: PlayRoute,
});

function PlayRoute() {
  return (
    <RequireAuth>
      <PlayScreen />
    </RequireAuth>
  );
}
