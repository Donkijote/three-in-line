import { Activity, useState } from "react";

import { ArrowRight, Loader, Pencil } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import { useCheckCodenameExists } from "@/infrastructure/convex/UserApi";
import { H1, P, Small } from "@/ui/web/components/typography";
import { Button } from "@/ui/web/components/ui/button";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/ui/web/components/ui/input-group";
import { AvatarOptions } from "@/ui/web/modules/login/components/AvatarOptions";

export const LoginScreen = () => {
  const [codeName, setCodeName] = useState("");
  const [doesCodeNameExist, setDoesCodeNameExist] = useState<boolean | null>(
    null,
  );
  const { checkCodenameExists, isChecking } = useCheckCodenameExists();

  const handleCheckCodeName = async (value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setDoesCodeNameExist(null);
      return;
    }

    try {
      const exists = await checkCodenameExists(trimmedValue);
      setDoesCodeNameExist(exists);
    } catch (error) {
      console.error("Failed to verify codename", error);
      setDoesCodeNameExist(null);
    }
  };

  const debouncedCheckCodeName = useDebouncedCallback(() => {
    void handleCheckCodeName(codeName);
  }, 600);

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(50%_45%_at_15%_0%,color-mix(in_oklch,var(--color-primary)_18%,transparent)_0%,transparent_70%)] px-6 py-12 text-foreground md:px-10 md:py-16">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-md flex-col gap-8 md:min-h-[calc(100vh-8rem)] md:max-w-2xl md:gap-10">
        <div className="space-y-4">
          <div className="h-1 w-12 rounded-full bg-primary" />
          <H1 className="text-5xl font-extrabold uppercase leading-none tracking-tight md:text-6xl">
            NEW
            <br />
            GAME
          </H1>
          <P className="text-base text-muted-foreground">
            Enter the arena. Choose your identity.
          </P>
        </div>

        <div className="flex flex-col gap-1 space-y-3">
          <Small className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
            Codename
          </Small>
          <InputGroup className="h-12 border-border/60 bg-card/40">
            <InputGroupInput
              id="login-codename"
              type="text"
              placeholder="Player 1"
              autoComplete="nickname"
              className="text-base text-foreground placeholder:text-muted-foreground/70"
              value={codeName}
              onChange={(event) => setCodeName(event.target.value)}
              onKeyDown={debouncedCheckCodeName}
            />
            <InputGroupButton
              type="button"
              className="mr-1 h-9 w-9 bg-primary/15 text-primary hover:bg-primary/25"
              aria-label="Edit codename"
            >
              {isChecking ? <Loader className={"animate-spin"} /> : <Pencil />}
            </InputGroupButton>
          </InputGroup>
        </div>

        <Activity
          name={"password-input"}
          mode={doesCodeNameExist === null ? "hidden" : "visible"}
        >
          <div className="flex flex-col gap-1 space-y-3">
            <Small className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
              Password
            </Small>
            <InputGroup className="h-12 border-border/60 bg-card/40">
              <InputGroupInput
                id="login-password"
                type="password"
                placeholder="Enter password"
                autoComplete="current-password"
                className="text-base text-foreground placeholder:text-muted-foreground/70"
              />
            </InputGroup>
          </div>
        </Activity>

        <div className="space-y-4 md:space-y-5">
          <div className="flex items-center justify-between">
            <Small className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
              Select avatar
            </Small>
            <Small className="text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
              Scroll for more
            </Small>
          </div>
          <AvatarOptions />
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-auto h-12 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {doesCodeNameExist === false ? "Sign up" : "START GAME"}
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
};
