import type { UserPreferences } from "@/domain/entities/UserPreferences";

export type UserPreferencesRepository = {
  load: () => UserPreferences;
  save: (preferences: UserPreferences) => void;
};
