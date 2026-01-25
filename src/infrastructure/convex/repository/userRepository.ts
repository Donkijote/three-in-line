import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import type { UserAvatar } from "@/domain/entities/Avatar";
import type {
  User,
  UserId,
  UserRepository,
} from "@/domain/ports/UserRepository";
import { convexClient } from "@/infrastructure/convex/client";

const toUserId = (id: string) => id as UserId;

export const toDomainUser = (user: Doc<"users">): User => ({
  id: toUserId(user._id),
  name: user.name ?? undefined,
  email: user.email ?? undefined,
  username: user.username ?? undefined,
  image: user.image ?? undefined,
  avatar: (user.avatar as UserAvatar) ?? undefined,
  avatars: (user.avatars as Array<UserAvatar>) ?? undefined,
});

export const userRepository: UserRepository = {
  checkEmailExists: async (email) =>
    convexClient.query(api.users.checkEmailExists, { email }),
  checkUsernameExists: async (username) =>
    convexClient.query(api.users.checkUsernameExists, { username }),
  getCurrentUser: async () => {
    const user = await convexClient.query(api.users.getCurrentUser);
    return user ? toDomainUser(user) : null;
  },
  updateUsername: async (username) => {
    const user = await convexClient.mutation(api.users.updateUsername, {
      username,
    });
    return toDomainUser(user as Doc<"users">);
  },
  updateAvatar: async (avatar: UserAvatar) => {
    const user = await convexClient.mutation(api.users.updateAvatar, {
      avatar,
    });
    return toDomainUser(user as Doc<"users">);
  },
};
