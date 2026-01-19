import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export function useTasks() {
  return useQuery(api.tasks.get);
}
