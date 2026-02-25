import { api } from "@/convex/_generated/api";
import type { UserDoc } from "@/convex/schemas/user";
import type { UserAvatar } from "@/domain/entities/Avatar";
import type { User } from "@/domain/entities/User";
import type { UserRepository } from "@/domain/ports/UserRepository";
import { mutation } from "@/infrastructure/convex/mutation";
import { query } from "@/infrastructure/convex/query";

export const toDomainUser = (user: UserDoc): User => ({
  id: user._id,
  name: user.name ?? undefined,
  email: user.email ?? undefined,
  username: user.username ?? undefined,
  image: user.image ?? undefined,
  avatar: (user.avatar as UserAvatar) ?? undefined,
  avatars: (user.avatars as Array<UserAvatar>) ?? undefined,
});

export const userRepository: UserRepository = {
  checkEmailExists: async (email) =>
    query(api.users.checkEmailExists, { email }),
  checkUsernameExists: async (username) =>
    query(api.users.checkUsernameExists, { username }),
  getCurrentUser: async () => {
    const user = await query(api.users.getCurrentUser);
    return user ? toDomainUser(user) : null;
  },
  updateUsername: async (username) => {
    const user = await mutation(api.users.updateUsername, {
      username,
    });
    return toDomainUser(user as UserDoc);
  },
  updateAvatar: async (avatar: UserAvatar) => {
    const user = await mutation(api.users.updateAvatar, {
      avatar,
    });
    return toDomainUser(user as UserDoc);
  },
};
