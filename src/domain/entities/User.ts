import type { UserAvatar } from "@/domain/entities/Avatar";

/**
 * String id to identify a user in ports and UI.
 */
export type UserId = User["id"];

/**
 * Domain representation of a user profile.
 */
export type User = {
  id: string;
  name?: string;
  email?: string;
  username?: string;
  image?: string;
  avatar?: UserAvatar;
  avatars?: UserAvatar[];
};
