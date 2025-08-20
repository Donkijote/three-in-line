export const StorageKeys = {
  GAMES: "GAMES",
  USER_SETTINGS: "USER_SETTINGS",
} as const;

export const StorageService = {
  get: (key: keyof typeof StorageKeys) => localStorage.getItem(key),
  set: <T>(key: keyof typeof StorageKeys, data: T) =>
    localStorage.setItem(key, JSON.stringify(data)),
  remove: (key: keyof typeof StorageKeys) => localStorage.removeItem(key),
};
