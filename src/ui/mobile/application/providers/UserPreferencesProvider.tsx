import type { PropsWithChildren } from "react";

import { userPreferencesSecureStoreRepository } from "@/infrastructure/mobile/storage/userPreferencesSecureStore";
import { UserPreferencesProvider as SharedUserPreferencesProvider } from "@/ui/shared/preferences/providers/UserPreferencesProvider";

export { useUserPreferences } from "@/ui/shared/preferences/providers/UserPreferencesProvider";

export const UserPreferencesProvider = ({ children }: PropsWithChildren) => {
  return (
    <SharedUserPreferencesProvider
      repository={userPreferencesSecureStoreRepository}
    >
      {children}
    </SharedUserPreferencesProvider>
  );
};
