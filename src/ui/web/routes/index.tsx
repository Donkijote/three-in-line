import { Authenticated } from "convex/react";

import { createFileRoute } from "@tanstack/react-router";

import { HomeScreen } from "@/ui/web/modules/home/screens/HomeScreen";

export const Route = createFileRoute("/")({
  component: HomeRoute,
});

function HomeRoute() {
  return (
    <Authenticated>
      <HomeScreen />
    </Authenticated>
  );
}
