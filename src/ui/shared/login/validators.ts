import type { UserAvatar } from "@/domain/entities/Avatar";
import type { LoginFormValues } from "@/ui/shared/login/types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value: string) => EMAIL_REGEX.test(value);

export const validateEmail = (value: string) => {
  if (!value) {
    return "Email is required";
  }

  if (!isValidEmail(value.trim())) {
    return "Email is not valid";
  }

  return undefined;
};

export const validatePassword = (value: string, isSignUp = false) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "Password is required";
  }

  if (isSignUp && trimmedValue.length < 6) {
    return "Password must be at least 6 characters";
  }

  return undefined;
};

export const validateAvatar = (value?: UserAvatar) =>
  value?.value ? undefined : "Avatar is required";

type ResolveSubmitStateArgs = {
  values: LoginFormValues;
  canSubmit: boolean;
  isSubmitting: boolean;
  isChecking: boolean;
  doesEmailExist: boolean | null;
  isEmailCheckPending: boolean;
};

export const resolveLoginSubmitState = ({
  values,
  canSubmit,
  isSubmitting,
  isChecking,
  doesEmailExist,
  isEmailCheckPending,
}: ResolveSubmitStateArgs) => {
  const emailValid = validateEmail(values.email.trim()) === undefined;
  const passwordValid =
    validatePassword(values.password, values.flow === "signUp") === undefined;
  const requirePassword = doesEmailExist !== null;
  const isDisabled =
    !canSubmit ||
    isSubmitting ||
    isChecking ||
    isEmailCheckPending ||
    !emailValid ||
    (requirePassword && !passwordValid);

  return {
    emailValid,
    isDisabled,
    passwordValid,
    requirePassword,
  };
};
