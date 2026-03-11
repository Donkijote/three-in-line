import type { PropsWithChildren } from "react";

import { userPreferencesLocalStorageRepository } from "@/infrastructure/storage/userPreferencesLocalStorage";
import { UserPreferencesProvider as SharedUserPreferencesProvider } from "@/ui/shared/preferences/providers/UserPreferencesProvider";

export { useUserPreferences } from "@/ui/shared/preferences/providers/UserPreferencesProvider";

export const UserPreferencesProvider = ({ children }: PropsWithChildren) => {
  return (
    <SharedUserPreferencesProvider
      repository={userPreferencesLocalStorageRepository}
    >
      {children}
    </SharedUserPreferencesProvider>
  );
};
