import { isThemePreference, type ThemePreference } from "@/ui/web/theme/theme";

export const localStorageKeys = {
  themePreference: "theme",
} as const;

type LocalStorageSchema = {
  [localStorageKeys.themePreference]: ThemePreference;
};

type LocalStorageKey = keyof LocalStorageSchema;

const parseJson = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const decoders: {
  [K in LocalStorageKey]: (value: unknown) => LocalStorageSchema[K] | null;
} = {
  [localStorageKeys.themePreference]: (value) =>
    isThemePreference(value) ? value : null,
};

export const readLocalStorage = <K extends LocalStorageKey>(
  key: K,
): LocalStorageSchema[K] | null => {
  if (typeof window === "undefined") return null;

  const rawValue = localStorage.getItem(key);
  if (!rawValue) return null;

  const parsed = parseJson(rawValue);
  return decoders[key](parsed);
};

export const writeLocalStorage = <K extends LocalStorageKey>(
  key: K,
  value: LocalStorageSchema[K],
) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalStorage = <K extends LocalStorageKey>(key: K) => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
};
