/**
 * Preset avatar ids available in the system.
 * These map to UI assets, but the domain only cares about the ids.
 */
export type PresetAvatarId =
  | "avatar-1"
  | "avatar-2"
  | "avatar-3"
  | "avatar-4"
  | "avatar-5"
  | "avatar-6"
  | "avatar-7"
  | "avatar-8"
  | "avatar-9"
  | "avatar-10"
  | "avatar-11"
  | "avatar-12"
  | "avatar-13"
  | "avatar-14"
  | "avatar-15"
  | "avatar-16"
  | "avatar-17"
  | "avatar-18"
  | "avatar-19"
  | "avatar-20"
  | "avatar-21"
  | "avatar-22"
  | "avatar-23"
  | "avatar-24"
  | "avatar-25"
  | "avatar-26"
  | "avatar-27"
  | "avatar-28"
  | "avatar-29"
  | "avatar-30"
  | "avatar-31"
  | "avatar-32"
  | "avatar-33"
  | "avatar-34"
  | "avatar-35"
  | "avatar-36"
  | "avatar-37"
  | "avatar-38";

/**
 * Canonical list of preset avatar ids.
 * Useful for guards, defaults, random selection, etc.
 */
export const PRESET_AVATAR_IDS: readonly PresetAvatarId[] = [
  "avatar-1",
  "avatar-2",
  "avatar-3",
  "avatar-4",
  "avatar-5",
  "avatar-6",
  "avatar-7",
  "avatar-8",
  "avatar-9",
  "avatar-10",
  "avatar-11",
  "avatar-12",
  "avatar-13",
  "avatar-14",
  "avatar-15",
  "avatar-16",
  "avatar-17",
  "avatar-18",
  "avatar-19",
  "avatar-20",
  "avatar-21",
  "avatar-22",
  "avatar-23",
  "avatar-24",
  "avatar-25",
  "avatar-26",
  "avatar-27",
  "avatar-28",
  "avatar-29",
  "avatar-30",
  "avatar-31",
  "avatar-32",
  "avatar-33",
  "avatar-34",
  "avatar-35",
  "avatar-36",
  "avatar-37",
  "avatar-38",
] as const;

/**
 * Domain representation of a user's avatar.
 */
export type UserAvatar =
  | { type: "preset"; value: PresetAvatarId }
  | { type: "generated"; value: string } // seed
  | { type: "custom"; value: string }; // storageId (later)

/**
 * Type guard for preset avatar ids.
 */
export const isPresetAvatarId = (value: string): value is PresetAvatarId =>
  (PRESET_AVATAR_IDS as readonly string[]).includes(value);

/**
 * Helper to pick a random preset avatar (nice for default signup).
 */
export const getRandomPresetAvatarId = (): PresetAvatarId =>
  PRESET_AVATAR_IDS[Math.floor(Math.random() * PRESET_AVATAR_IDS.length)];
