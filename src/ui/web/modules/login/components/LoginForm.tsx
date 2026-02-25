import { Activity } from "react";

import { ArrowRight, Loader, Pencil } from "lucide-react";

import { getRandomPresetAvatarId } from "@/domain/entities/Avatar";
import { toUserAvatar } from "@/ui/shared/avatars/presets";
import { useLoginFlow } from "@/ui/shared/login/useLoginFlow";
import {
  resolveLoginSubmitState,
  validateAvatar,
  validateEmail,
  validatePassword,
} from "@/ui/shared/login/validators";
import { Small } from "@/ui/web/components/Typography";
import { Button } from "@/ui/web/components/ui/button";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/ui/web/components/ui/input-group";
import { AvatarOptions } from "@/ui/web/modules/login/components/AvatarOptions";
import { LoginErrorAlert } from "@/ui/web/modules/login/components/LoginErrorAlert";

export const LoginForm = () => {
  const {
    authError,
    doesEmailExist,
    form,
    isEmailCheckPending,
    isChecking,
    isSignUp,
    onEmailChanged,
    setAuthError,
  } = useLoginFlow();

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
        <Small variant="label" className="text-primary/90">
          Email
        </Small>
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => validateEmail(value),
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
                  const nextValue = event.target.value;
                  field.handleChange(nextValue);
                  onEmailChanged(nextValue);
                }}
                onBlur={field.handleBlur}
              />
              <InputGroupButton
                type="button"
                className="mr-1 h-9 w-9 bg-primary/15 text-primary hover:bg-primary/25"
                aria-label="Edit email"
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
        mode={doesEmailExist === null ? "hidden" : "visible"}
      >
        <div className="flex flex-col gap-1 space-y-3">
          <Small variant="label" className="text-primary/90">
            Password
          </Small>
          <form.Field
            name="password"
            validators={{
              onBlur: ({ value }) => validatePassword(value, isSignUp),
            }}
          >
            {(field) => {
              const passwordError = field.state.meta.errors[0];
              const passwordErrorMessage =
                typeof passwordError === "string" ? passwordError : undefined;

              return (
                <div className="space-y-2">
                  <InputGroup className="h-12 border-border bg-card">
                    <InputGroupInput
                      id="login-password"
                      type="password"
                      placeholder="Enter password"
                      autoComplete="current-password"
                      className="text-base text-foreground placeholder:text-muted-foreground/70"
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={field.handleBlur}
                    />
                  </InputGroup>
                  {passwordErrorMessage ? (
                    <Small className="text-destructive">
                      {passwordErrorMessage}
                    </Small>
                  ) : null}
                </div>
              );
            }}
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
            onChange: ({ value }) => validateAvatar(value),
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
          values: state.values,
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {({ values, canSubmit, isSubmitting }) => {
          const { isDisabled } = resolveLoginSubmitState({
            values,
            canSubmit,
            isSubmitting,
            isChecking,
            doesEmailExist,
            isEmailCheckPending: isEmailCheckPending(values.email),
          });

          return (
            <Button
              type="submit"
              size="lg"
              className="mt-auto h-12 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isDisabled}
            >
              {isSignUp ? "Sign up" : "START GAME"}
              {isSubmitting ? (
                <Loader className={"animate-spin"} />
              ) : (
                <ArrowRight />
              )}
            </Button>
          );
        }}
      </form.Subscribe>

      <LoginErrorAlert error={authError} onClose={() => setAuthError(null)} />
    </form>
  );
};
