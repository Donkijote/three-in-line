import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { loadUserPreferences } from "@/application/preferences/loadUserPreferences";
import { updateUserPreferences } from "@/application/preferences/updateUserPreferences";
import type { UserPreferences } from "@/domain/entities/UserPreferences";
import { userPreferencesLocalStorageRepository } from "@/infrastructure/storage/userPreferencesLocalStorage";

type UserPreferencesContextValue = {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
};

const UserPreferencesContext =
  createContext<UserPreferencesContextValue | null>(null);

export const UserPreferencesProvider = ({ children }: PropsWithChildren) => {
  const [preferences, setPreferences] = useState(() =>
    loadUserPreferences(userPreferencesLocalStorageRepository),
  );

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences((current) =>
      updateUserPreferences(
        userPreferencesLocalStorageRepository,
        updates,
        current,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({ preferences, updatePreferences }),
    [preferences, updatePreferences],
  );

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error(
      "useUserPreferences must be used within UserPreferencesProvider",
    );
  }

  return context;
};
