export const themePreferences = ["light", "dark", "system"] as const;

export type ThemePreference = (typeof themePreferences)[number];

export const isThemePreference = (value: unknown): value is ThemePreference =>
  typeof value === "string" &&
  (themePreferences as readonly string[]).includes(value);

export type UserPreferences = {
  theme: ThemePreference;
  gameSounds: boolean;
  haptics: boolean;
};

export const defaultUserPreferences: UserPreferences = {
  theme: "system",
  gameSounds: true,
  haptics: true,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

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
