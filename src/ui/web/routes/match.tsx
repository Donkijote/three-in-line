import { createFileRoute, redirect } from "@tanstack/react-router";

import type { GameId } from "@/domain/entities/Game";
import { MatchErrorScreen } from "@/ui/web/modules/match/screens/MatchErrorScreen";
import { MatchScreen } from "@/ui/web/modules/match/screens/MatchScreen";
import { RequireAuth } from "@/ui/web/router/auth";

export const Route = createFileRoute("/match")({
  validateSearch: (search) => {
    if (typeof search.gameId !== "string") {
      throw redirect({ to: "/play" });
    }
    return { gameId: search.gameId as GameId };
  },
  component: MatchRoute,
  errorComponent: MatchRouteError,
});

function MatchRoute() {
  const search = Route.useSearch();
  return (
    <RequireAuth>
      <MatchScreen gameId={search.gameId} />
    </RequireAuth>
  );
}

type MatchRouteErrorProps = {
  error: unknown;
};

function MatchRouteError({ error }: Readonly<MatchRouteErrorProps>) {
  return (
    <RequireAuth>
      <MatchErrorScreen error={error} />
    </RequireAuth>
  );
}
