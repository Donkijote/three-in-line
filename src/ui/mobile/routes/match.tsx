import { useEffect } from "react";

import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useGameById } from "@/infrastructure/convex/GameApi";
import { useMobileHeader } from "@/ui/mobile/application/providers/MobileHeaderProvider";
import { H3, H6, Muted, P } from "@/ui/mobile/components/Typography";
import { Button } from "@/ui/mobile/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/mobile/components/ui/card";
import { RequireAuth } from "@/ui/mobile/router/auth";

const MatchRouteContent = () => {
  const { gameId } = useLocalSearchParams<{ gameId?: string }>();
  const { setHeader } = useMobileHeader();
  const game = useGameById(typeof gameId === "string" ? gameId : null);

  useEffect(() => {
    setHeader({
      title: "Match",
      eyebrow: "Live Session",
      leftSlot: (
        <Button size="sm" variant="ghost" onPress={() => router.back()}>
          <P>Back</P>
        </Button>
      ),
    });

    return () => {
      setHeader(null);
    };
  }, [setHeader]);

  if (typeof gameId !== "string") {
    return (
      <View className="flex-1 justify-center">
        <Card className="rounded-3xl border-border/60">
          <CardHeader>
            <CardTitle>Missing match</CardTitle>
            <CardDescription>
              A game id is required before the mobile match screen can load.
            </CardDescription>
          </CardHeader>
        </Card>
      </View>
    );
  }

  if (game === undefined) {
    return (
      <View className="flex-1 items-center justify-center gap-3">
        <ActivityIndicator />
        <Muted>Loading match...</Muted>
      </View>
    );
  }

  return (
    <View className="flex-1 gap-6 pb-12">
      <View className="gap-2 pt-2">
        <H3 className="text-left">Game ready</H3>
        <Muted className="text-base leading-6">
          The new game was created from the mobile play flow. This route is now
          wired and ready for the full mobile match board implementation.
        </Muted>
      </View>

      <Card className="rounded-3xl border-border/60">
        <CardHeader>
          <CardTitle>Session details</CardTitle>
          <CardDescription>
            Use this data to verify the selected mode.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-3">
          <View className="flex-row items-center justify-between">
            <Muted className="mt-0">Game ID</Muted>
            <H6 className="text-right">{gameId}</H6>
          </View>
          <View className="flex-row items-center justify-between">
            <Muted className="mt-0">Status</Muted>
            <H6 className="text-right">{game?.status ?? "Not found"}</H6>
          </View>
          <View className="flex-row items-center justify-between">
            <Muted className="mt-0">Grid</Muted>
            <H6 className="text-right">
              {game ? `${game.gridSize}x${game.gridSize}` : "Unavailable"}
            </H6>
          </View>
          <View className="flex-row items-center justify-between">
            <Muted className="mt-0">Format</Muted>
            <H6 className="text-right">
              {game ? game.match.format.toUpperCase() : "Unavailable"}
            </H6>
          </View>
        </CardContent>
      </Card>
    </View>
  );
};

export default function MatchRoute() {
  return (
    <RequireAuth>
      <MatchRouteContent />
    </RequireAuth>
  );
}
