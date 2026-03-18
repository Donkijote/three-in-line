import { useLocalSearchParams } from "expo-router";

import type { GameId } from "@/domain/entities/Game";
import { MatchScreen } from "@/ui/mobile/modules/match/screens/MatchScreen";
import { RequireAuth } from "@/ui/mobile/router/auth";

const MatchRouteContent = () => {
  const { gameId } = useLocalSearchParams<{ gameId?: string }>();
  const resolvedGameId =
    typeof gameId === "string" ? (gameId as GameId) : undefined;

  return <MatchScreen gameId={resolvedGameId} />;
};

export default function MatchRoute() {
  return (
    <RequireAuth>
      <MatchRouteContent />
    </RequireAuth>
  );
}
