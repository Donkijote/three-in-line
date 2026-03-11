import * as SecureStore from "expo-secure-store";

import {
  coerceUserPreferences,
  type UserPreferences,
} from "@/domain/entities/UserPreferences";
import type { UserPreferencesRepository } from "@/domain/ports/UserPreferencesRepository";

const userPreferencesStorageKey = "userPreferences";

const parseJson = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const userPreferencesSecureStoreRepository: UserPreferencesRepository = {
  load: () => {
    try {
      const rawValue = SecureStore.getItem(userPreferencesStorageKey);
      if (!rawValue) {
        return coerceUserPreferences(null);
      }

      return coerceUserPreferences(parseJson(rawValue));
    } catch (error) {
      console.error("Failed to load mobile user preferences", error);
      return coerceUserPreferences(null);
    }
  },
  save: (preferences: UserPreferences) => {
    try {
      SecureStore.setItem(
        userPreferencesStorageKey,
        JSON.stringify(preferences),
      );
    } catch (error) {
      console.error("Failed to save mobile user preferences", error);
    }
  },
};
