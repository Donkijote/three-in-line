import {
  localStorageKeys,
  readLocalStorage,
  writeLocalStorage,
} from "@/infrastructure/storage/webLocalStorage";

import type { ThemePreference } from "./theme";

export const loadThemePreference = () =>
  readLocalStorage(localStorageKeys.themePreference);

export const saveThemePreference = (value: ThemePreference) =>
  writeLocalStorage(localStorageKeys.themePreference, value);
