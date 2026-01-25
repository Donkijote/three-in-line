import { Activity, useEffect, useEffectEvent, useState } from "react";

import { ArrowRight, Loader, Pencil } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import { useAuthActions } from "@convex-dev/auth/react";
import { useForm } from "@tanstack/react-form";

import {
  getRandomPresetAvatarId,
  type UserAvatar,
} from "@/domain/entities/Avatar";
import { toUserAvatar } from "@/ui/shared/avatars/presets";
import { Small } from "@/ui/web/components/Typography";
import { Button } from "@/ui/web/components/ui/button";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/ui/web/components/ui/input-group";
import { useCheckEmailExists } from "@/ui/web/hooks/useUser";
import { isValidEmail } from "@/ui/web/lib/utils";
import { AvatarOptions } from "@/ui/web/modules/login/components/AvatarOptions";

type LoginFormData = {
  email: string;
  password: string;
  flow: string;
  avatar?: UserAvatar;
};

export const LoginForm = () => {
  const { signIn } = useAuthActions();
  const [doesCodeNameExist, setDoesCodeNameExist] = useState<boolean | null>(
    null,
  );
  const { checkEmailExists, isChecking } = useCheckEmailExists();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      flow: "",
    } as LoginFormData,
    onSubmit: async ({ value }) => {
      const payload =
        value.flow === "signIn"
          ? { email: value.email, password: value.password, flow: value.flow }
          : value;

      await signIn("password", payload);
    },
  });

  const handleCheckCodeName = async (value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setDoesCodeNameExist(null);
      return;
    }

    try {
      const exists = await checkEmailExists(trimmedValue);
      setDoesCodeNameExist(exists);
    } catch (error) {
      console.error("Failed to verify codename", error);
      setDoesCodeNameExist(null);
    }
  };

  const debouncedCheckCodeName = useDebouncedCallback((value: string) => {
    void handleCheckCodeName(value);
  }, 600);

  const isSignUp = doesCodeNameExist === false;

  const updateFlowField = useEffectEvent((value: boolean | null) => {
    form.setFieldValue("flow", value ? "signIn" : "signUp", {});
  });

  useEffect(() => {
    updateFlowField(doesCodeNameExist);
  }, [doesCodeNameExist]);

  return (
    <form
      className="flex flex-col gap-8 flex-1"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <form.Field name={"flow"}>
        {(field) => (
          <input name="flow" type="hidden" value={field.state.value} />
        )}
      </form.Field>
      <div className="flex flex-col gap-1 space-y-3">
        <Small className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
          Email
        </Small>
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              if (!value) {
                return "Email is required";
              }

              if (!isValidEmail(value.trim())) {
                return "Email is not valid";
              }

              return undefined;
            },
          }}
        >
          {(field) => (
            <InputGroup className="h-12 border-border bg-card">
              <InputGroupInput
                id="login-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="text-base text-foreground placeholder:text-muted-foreground/70"
                value={field.state.value}
                onChange={(event) => {
                  field.handleChange(event.target.value);
                  if (field.state.meta.isValid) {
                    debouncedCheckCodeName(event.target.value);
                  }
                }}
                onBlur={field.handleBlur}
              />
              <InputGroupButton
                type="button"
                className="mr-1 h-9 w-9 bg-primary/15 text-primary hover:bg-primary/25"
                aria-label="Edit codename"
              >
                {isChecking ? (
                  <Loader className={"animate-spin size-4"} />
                ) : (
                  <Pencil className={"size-4"} />
                )}
              </InputGroupButton>
            </InputGroup>
          )}
        </form.Field>
      </div>
      <Activity
        name={"password-input"}
        mode={doesCodeNameExist === null ? "hidden" : "visible"}
      >
        <div className="flex flex-col gap-1 space-y-3">
          <Small className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
            Password
          </Small>
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                value.trim() ? undefined : "Password is required",
            }}
          >
            {(field) => (
              <InputGroup className="h-12 border-border bg-card">
                <InputGroupInput
                  id="login-password"
                  type="password"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="text-base text-foreground placeholder:text-muted-foreground/70"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                />
              </InputGroup>
            )}
          </form.Field>
        </div>
      </Activity>

      <Activity name={"avatars"} mode={isSignUp ? "visible" : "hidden"}>
        <form.Field
          name="avatar"
          defaultValue={{
            type: "preset",
            value: getRandomPresetAvatarId(),
          }}
          validators={{
            onChange: ({ value }) =>
              value?.value ? undefined : "Avatar is required",
          }}
        >
          {(field) => (
            <>
              <input
                name="avatar.type"
                type="hidden"
                value={field.state.value?.type}
              />
              <input
                name="avatar.value"
                type="hidden"
                value={field.state.value?.value}
              />
              <AvatarOptions
                onChange={(avatar) => {
                  field.handleChange(toUserAvatar(avatar));
                }}
              />
            </>
          )}
        </form.Field>
      </Activity>

      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {({ canSubmit, isSubmitting }) => (
          <Button
            type="submit"
            size="lg"
            className="mt-auto h-12 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={!canSubmit || isSubmitting}
          >
            {doesCodeNameExist === false ? "Sign up" : "START GAME"}
            {isSubmitting ? (
              <Loader className={"animate-spin"} />
            ) : (
              <ArrowRight />
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
};
