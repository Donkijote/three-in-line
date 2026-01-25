import { createFileRoute, redirect } from "@tanstack/react-router";

import { MatchScreen } from "@/ui/web/modules/match/screens/MatchScreen";
import { RequireAuth } from "@/ui/web/router/auth";

export const Route = createFileRoute("/match")({
  validateSearch: (search) => {
    if (typeof search.gameId !== "string") {
      throw redirect({ to: "/play" });
    }
    return { gameId: search.gameId };
  },
  component: MatchRoute,
});

function MatchRoute() {
  const search = Route.useSearch();
  return (
    <RequireAuth>
      <MatchScreen gameId={search.gameId} />
    </RequireAuth>
  );
}
