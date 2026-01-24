import type { UserPreferences } from "@/domain/entities/UserPreferences";
import { coerceUserPreferences } from "@/domain/entities/UserPreferences";
import type { UserPreferencesRepository } from "@/domain/ports/UserPreferencesRepository";

export const updateUserPreferences = (
  repository: UserPreferencesRepository,
  updates: Partial<UserPreferences>,
  current?: UserPreferences,
) => {
  const base = current ?? repository.load();
  const next = coerceUserPreferences({ ...base, ...updates });
  repository.save(next);
  return next;
};
