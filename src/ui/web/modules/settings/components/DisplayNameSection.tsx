import type { ChangeEvent } from "react";

import { CircleCheck, CircleX, Loader } from "lucide-react";

import { useDisplayNameSection } from "@/ui/shared/settings/hooks/useDisplayNameSection";
import { Small } from "@/ui/web/components/Typography";
import { Button } from "@/ui/web/components/ui/button";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/ui/web/components/ui/input-group";

export const DisplayNameSection = () => {
  const {
    displayName,
    isBusy,
    isUpdating,
    onAcceptDisplayName,
    onDisplayNameChanged,
    shouldShowAccept,
    status,
  } = useDisplayNameSection();

  const renderStatusIcon = () => {
    if (isBusy) {
      return <Loader className="size-6 animate-spin text-muted-foreground" />;
    }

    if (status === "empty" || status === "idle") {
      return null;
    }

    return status === "taken" ? (
      <CircleX className="size-6 text-destructive" />
    ) : (
      <CircleCheck className="size-6 text-primary" />
    );
  };

  return (
    <div className="flex flex-col justify-center gap-2">
      <div className="flex items-center justify-between h-8">
        <Small variant="label" className="text-muted-foreground">
          Display Name
        </Small>
        {shouldShowAccept && (
          <Button
            type="button"
            variant="outline"
            className={"text-primary tracking-widest"}
            size="sm"
            onClick={() => void onAcceptDisplayName()}
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
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onDisplayNameChanged(event.target.value);
          }}
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
