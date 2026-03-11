import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";

import { loadUserPreferences } from "@/application/preferences/loadUserPreferences";
import { updateUserPreferences } from "@/application/preferences/updateUserPreferences";
import type { UserPreferences } from "@/domain/entities/UserPreferences";
import type { UserPreferencesRepository } from "@/domain/ports/UserPreferencesRepository";

type UserPreferencesContextValue = {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
};

type UserPreferencesProviderProps = PropsWithChildren<{
  repository: UserPreferencesRepository;
}>;

const UserPreferencesContext =
  createContext<UserPreferencesContextValue | null>(null);

export const UserPreferencesProvider = ({
  children,
  repository,
}: UserPreferencesProviderProps) => {
  const [preferences, setPreferences] = useState(() =>
    loadUserPreferences(repository),
  );

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((current) =>
      updateUserPreferences(repository, updates, current),
    );
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreferences }}>
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
