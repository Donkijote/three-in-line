import { useEffect, useState } from "react";

import { useDebouncedCallback } from "use-debounce";

import {
  useCheckUsernameExists,
  useCurrentUser,
  useUpdateUsername,
} from "@/ui/shared/user/hooks/useUser";

type DisplayNameStatus = "empty" | "idle" | "taken" | "available";

export const useDisplayNameSection = () => {
  const currentUser = useCurrentUser();
  const currentUsername = currentUser?.username?.trim() ?? "";
  const [displayName, setDisplayName] = useState("");
  const [hasEdited, setHasEdited] = useState(false);
  const [doesNameExist, setDoesNameExist] = useState<boolean | null>(null);
  const { checkUsernameExists, isChecking } = useCheckUsernameExists();
  const updateUsername = useUpdateUsername();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (hasEdited) {
      return;
    }

    setDisplayName(currentUsername);
    setDoesNameExist(currentUsername ? false : null);
  }, [currentUsername, hasEdited]);

  const trimmedDisplayName = displayName.trim();

  const handleCheckUsername = async (value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setDoesNameExist(null);
      return;
    }

    if (trimmedValue === currentUsername) {
      setDoesNameExist(false);
      return;
    }

    try {
      const exists = await checkUsernameExists(trimmedValue);
      setDoesNameExist(exists);
    } catch (error) {
      console.error("Failed to verify username", error);
      setDoesNameExist(null);
    }
  };

  const debouncedCheckUsername = useDebouncedCallback((value: string) => {
    void handleCheckUsername(value);
  }, 600);

  useEffect(() => {
    return () => {
      debouncedCheckUsername.cancel();
    };
  }, [debouncedCheckUsername]);

  const onDisplayNameChanged = (nextValue: string) => {
    setDisplayName(nextValue);
    setHasEdited(true);

    if (!nextValue.trim()) {
      debouncedCheckUsername.cancel();
      setDoesNameExist(null);
      return;
    }

    if (nextValue.trim() === currentUsername) {
      debouncedCheckUsername.cancel();
      setDoesNameExist(false);
      return;
    }

    debouncedCheckUsername(nextValue);
  };

  const onAcceptDisplayName = async () => {
    setIsUpdating(true);
    try {
      await updateUsername({ username: trimmedDisplayName });
      setDisplayName(trimmedDisplayName);
      setHasEdited(false);
      setDoesNameExist(null);
    } catch (error) {
      console.error("Failed to update username", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const shouldShowAccept =
    Boolean(trimmedDisplayName) &&
    trimmedDisplayName !== currentUsername &&
    doesNameExist === false &&
    !isUpdating;

  const isBusy = isChecking || isUpdating;
  const status: DisplayNameStatus = !trimmedDisplayName
    ? "empty"
    : doesNameExist === null
      ? "idle"
      : doesNameExist
        ? "taken"
        : "available";

  return {
    displayName,
    isBusy,
    isUpdating,
    onAcceptDisplayName,
    onDisplayNameChanged,
    shouldShowAccept,
    status,
  };
};

export type { DisplayNameStatus };
