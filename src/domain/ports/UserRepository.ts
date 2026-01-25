import type { UserAvatar } from "@/domain/entities/Avatar";
import type { User } from "@/domain/entities/User";

export interface UserRepository {
  /**
   * Check whether an email already exists (normalized server-side).
   */
  checkEmailExists: (email: string) => Promise<boolean>;
  /**
   * Check whether a username already exists (normalized server-side).
   */
  checkUsernameExists: (username: string) => Promise<boolean>;
  /**
   * Fetch the currently authenticated user, if any.
   */
  getCurrentUser: () => Promise<User | null>;
  /**
   * Update the current user's username.
   */
  updateUsername: (username: string) => Promise<User>;
  /**
   * Update the current user's avatar.
   */
  updateAvatar: (avatar: UserAvatar) => Promise<User>;
}
