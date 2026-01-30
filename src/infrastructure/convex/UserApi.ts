import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { UserId as ConvexUserId, UserDoc } from "@/convex/schemas/user";
import type { User } from "@/domain/entities/User";
import { toDomainUser } from "@/infrastructure/convex/repository/userRepository";

export const useCurrentUserQuery = (): User | null | undefined => {
  const user = useQuery(api.users.getCurrentUser);
  return user ? toDomainUser(user as UserDoc) : user;
};

export const useUserByIdQuery = (
  userId?: string | null,
): User | null | undefined => {
  const resolvedId = userId ? (userId as unknown as ConvexUserId) : undefined;
  const user = useQuery(
    api.users.getUserById,
    resolvedId ? { userId: resolvedId } : "skip",
  );
  return user ? toDomainUser(user as UserDoc) : user;
};
