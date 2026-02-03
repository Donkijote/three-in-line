import type { UserPreferencesRepository } from "@/domain/ports/UserPreferencesRepository";

export const loadUserPreferences = (repository: UserPreferencesRepository) =>
  repository.load();
