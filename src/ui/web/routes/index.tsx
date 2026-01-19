import { createFileRoute } from "@tanstack/react-router";

import { ComponentExample } from "../components/component-example";

export const Route = createFileRoute("/")({
  component: HomeRoute,
});

function HomeRoute() {
  return <ComponentExample />;
}
