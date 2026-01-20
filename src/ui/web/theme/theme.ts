export const themePreferences = ["light", "dark", "system"] as const;

export type ThemePreference = (typeof themePreferences)[number];

export const isThemePreference = (value: unknown): value is ThemePreference =>
  typeof value === "string" &&
  (themePreferences as readonly string[]).includes(value);
