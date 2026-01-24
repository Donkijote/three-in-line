import { type ChangeEvent, useEffect, useMemo, useState } from "react";

import { CircleCheck, CircleX, Loader } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import {
  useCheckUsernameExists,
  useCurrentUser,
  useUpdateUsername,
} from "@/infrastructure/convex/UserApi";
import { Small } from "@/ui/web/components/Typography";
import { Button } from "@/ui/web/components/ui/button";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/ui/web/components/ui/input-group";

export const DisplayNameSection = () => {
  const currentUser = useCurrentUser();
  const currentUsername = currentUser?.username?.trim() ?? "";
  const [displayName, setDisplayName] = useState("");
  const [hasEdited, setHasEdited] = useState(false);
  const [doesNameExist, setDoesNameExist] = useState<boolean | null>(null);
  const { checkUsernameExists, isChecking } = useCheckUsernameExists();
  const updateUsername = useUpdateUsername();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (hasEdited || displayName) {
      return;
    }

    setDisplayName(currentUsername);
    setDoesNameExist(currentUsername ? false : null);
  }, [currentUsername, displayName, hasEdited]);

  const trimmedDisplayName = useMemo(() => displayName.trim(), [displayName]);

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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
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

  const handleAccept = async () => {
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

  const renderStatusIcon = () => {
    if (!trimmedDisplayName) {
      return null;
    }

    if (isChecking || isUpdating) {
      return <Loader className="size-6 animate-spin text-muted-foreground" />;
    }

    if (doesNameExist === null) {
      return null;
    }

    return doesNameExist ? (
      <CircleX className="size-6 text-destructive" />
    ) : (
      <CircleCheck className="size-6 text-primary" />
    );
  };

  return (
    <div className="flex flex-col justify-center gap-2">
      <div className="flex items-center justify-between h-8">
        <Small className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Display Name
        </Small>
        {shouldShowAccept && (
          <Button
            type="button"
            variant="outline"
            className={"text-primary tracking-widest"}
            size="sm"
            onClick={() => void handleAccept()}
            disabled={isUpdating}
          >
            Accept
          </Button>
        )}
      </div>
      <InputGroup className="h-12 border-border bg-card">
        <InputGroupInput
          id="login-username"
          type="text"
          placeholder={"PixelMaster_99"}
          className={
            "text-base text-foreground placeholder:text-muted-foreground/70"
          }
          value={displayName}
          onChange={handleChange}
          disabled={isUpdating}
        />
        <InputGroupButton
          type="button"
          className={"mr-1 hover:bg-transparent!"}
          aria-label="Edit username"
          disabled={isUpdating}
        >
          {renderStatusIcon()}
        </InputGroupButton>
      </InputGroup>
    </div>
  );
};
