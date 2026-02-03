export const localStorageKeys = {
  userPreferences: "userPreferences",
} as const;

type LocalStorageKey = (typeof localStorageKeys)[keyof typeof localStorageKeys];

const parseJson = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const readLocalStorage = (key: LocalStorageKey): unknown | null => {
  if (typeof window === "undefined") return null;

  const rawValue = localStorage.getItem(key);
  if (!rawValue) return null;

  return parseJson(rawValue);
};

export const writeLocalStorage = (key: LocalStorageKey, value: unknown) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalStorage = (key: LocalStorageKey) => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
};
