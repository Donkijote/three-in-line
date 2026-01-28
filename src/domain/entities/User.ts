import type { UserAvatar } from "@/domain/entities/Avatar";

/**
 * Branded id to identify a user in ports and UI.
 */
export type UserId = string & { readonly __brand: "UserId" };

/**
 * Domain representation of a user profile.
 */
export type User = {
  id: UserId;
  name?: string;
  email?: string;
  username?: string;
  image?: string;
  avatar?: UserAvatar;
  avatars?: UserAvatar[];
};
