import {
  coerceUserPreferences,
  type UserPreferences,
} from "@/domain/entities/UserPreferences";
import type { UserPreferencesRepository } from "@/domain/ports/UserPreferencesRepository";
import {
  localStorageKeys,
  readLocalStorage,
  writeLocalStorage,
} from "@/infrastructure/storage/webLocalStorage";

export const userPreferencesLocalStorageRepository: UserPreferencesRepository =
  {
    load: () =>
      coerceUserPreferences(readLocalStorage(localStorageKeys.userPreferences)),
    save: (preferences: UserPreferences) =>
      writeLocalStorage(localStorageKeys.userPreferences, preferences),
  };
