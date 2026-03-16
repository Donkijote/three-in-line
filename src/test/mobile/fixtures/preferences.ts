import type { UserPreferences } from "@/domain/entities/UserPreferences";

export const createUserPreferences = (
  overrides: Partial<UserPreferences> = {},
): UserPreferences => ({
  gameSounds: true,
  haptics: true,
  theme: "system",
  ...overrides,
});
