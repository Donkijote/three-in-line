export const GameStorage = {
  GAMES: "GAMES",
} as const;

export const GameStorageService = {
  get: (key: keyof typeof GameStorage) => localStorage.getItem(key),
  set: <T>(key: keyof typeof GameStorage, data: T) =>
    localStorage.setItem(key, JSON.stringify(data)),
  remove: (key: keyof typeof GameStorage) => localStorage.removeItem(key),
};
