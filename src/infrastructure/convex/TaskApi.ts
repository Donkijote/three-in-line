import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export function useTasks() {
  return useQuery(api.tasks.get);
}

export function useToggleTaskCompletion() {
  return useMutation(api.tasks.toggleTaskCompletion);
}
