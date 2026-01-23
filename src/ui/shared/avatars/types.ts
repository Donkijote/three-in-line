import type { PresetAvatarId } from "@/domain/entities/Avatar";

export type AvatarPreset = {
  id: PresetAvatarId;
  /**
   * UI label
   */
  name: string;
  /**
   * Fallback for when you render initials instead of an image.
   */
  initials: string;
  /**
   * Public URL to the static asset /public/avatars
   */
  src: string;
};
