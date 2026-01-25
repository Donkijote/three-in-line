import type { UserPreferences } from "@/domain/entities/UserPreferences";

export type UserPreferencesRepository = {
  /**
   * Load preferences from the configured storage.
   */
  load: () => UserPreferences;
  /**
   * Persist preferences to the configured storage.
   */
  save: (preferences: UserPreferences) => void;
};
