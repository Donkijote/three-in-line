/**
 * Supported theme values for user preferences.
 */
export const themePreferences = ["light", "dark", "system"] as const;

/**
 * Union type for valid theme preferences.
 */
export type ThemePreference = (typeof themePreferences)[number];

/**
 * Runtime guard for theme preference values.
 */
export const isThemePreference = (value: unknown): value is ThemePreference =>
  typeof value === "string" &&
  (themePreferences as readonly string[]).includes(value);

/**
 * Domain representation of user preferences.
 */
export type UserPreferences = {
  theme: ThemePreference;
  gameSounds: boolean;
  haptics: boolean;
};

/**
 * Default preferences for new or invalid entries.
 */
export const defaultUserPreferences: UserPreferences = {
  theme: "system",
  gameSounds: true,
  haptics: true,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/**
 * Coerce arbitrary input into a validated preferences object.
 */
export const coerceUserPreferences = (value: unknown): UserPreferences => {
  if (!isRecord(value)) {
    return defaultUserPreferences;
  }

  return {
    theme: isThemePreference(value.theme)
      ? value.theme
      : defaultUserPreferences.theme,
    gameSounds:
      typeof value.gameSounds === "boolean"
        ? value.gameSounds
        : defaultUserPreferences.gameSounds,
    haptics:
      typeof value.haptics === "boolean"
        ? value.haptics
        : defaultUserPreferences.haptics,
  };
};
