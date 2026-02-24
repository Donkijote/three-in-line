import { useEffect, useRef, useState } from "react";

import { useDebouncedCallback } from "use-debounce";

import { useAuthActions } from "@convex-dev/auth/react";
import { useForm } from "@tanstack/react-form";

import type { LoginFormValues } from "@/ui/shared/login/types";
import { useCheckEmailExists } from "@/ui/shared/login/useCheckEmailExists";
import { isValidEmail } from "@/ui/shared/login/validators";

const toAuthError = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "string" && error.trim()) {
    return new Error(error);
  }

  return new Error(fallbackMessage);
};

export const useLoginFlow = () => {
  const { signIn } = useAuthActions();
  const { checkEmailExists, isChecking } = useCheckEmailExists();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      flow: "",
    } as LoginFormValues,
    onSubmit: async ({ value }) => {
      await submit(value);
    },
  });
  const [doesEmailExist, setDoesEmailExist] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState<unknown>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const latestRequestId = useRef(0);

  const handleCheckEmail = async (email: string) => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setDoesEmailExist(null);
      setPendingEmail(null);
      return;
    }

    const requestId = ++latestRequestId.current;

    try {
      const exists = await checkEmailExists(trimmedEmail);

      if (latestRequestId.current !== requestId) {
        return;
      }

      setDoesEmailExist(exists);
    } catch (error) {
      if (latestRequestId.current !== requestId) {
        return;
      }

      console.error("Failed to verify email", error);
      setAuthError(toAuthError(error, "Failed to verify email."));
      setDoesEmailExist(null);
    } finally {
      if (latestRequestId.current === requestId) {
        setPendingEmail(null);
      }
    }
  };

  const debouncedCheckEmail = useDebouncedCallback((email: string) => {
    void handleCheckEmail(email);
  }, 600);

  const resetEmailCheck = () => {
    latestRequestId.current += 1;
    setDoesEmailExist(null);
    setPendingEmail(null);
    debouncedCheckEmail.cancel();
  };

  const onEmailChanged = (email: string) => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      resetEmailCheck();
      return;
    }

    latestRequestId.current += 1;
    setDoesEmailExist(null);
    setPendingEmail(trimmedEmail);
    debouncedCheckEmail(trimmedEmail);
  };

  useEffect(() => {
    if (doesEmailExist === null) {
      return;
    }

    form.setFieldValue("flow", doesEmailExist ? "signIn" : "signUp", {});
  }, [doesEmailExist, form]);

  const submit = async (values: LoginFormValues) => {
    const payload =
      values.flow === "signIn"
        ? {
            email: values.email,
            password: values.password,
            flow: values.flow,
          }
        : {
            email: values.email,
            password: values.password,
            flow: "signUp" as const,
            ...(values.avatar ? { avatar: values.avatar } : {}),
          };

    try {
      setAuthError(null);
      await signIn("password", payload);
    } catch (error) {
      console.error("Authentication failed", error);
      setAuthError(
        toAuthError(error, "We couldn't get you into the arena. Try again."),
      );
    }
  };

  useEffect(() => {
    return () => {
      debouncedCheckEmail.cancel();
    };
  }, [debouncedCheckEmail]);

  const isEmailCheckPending = (email: string) => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      return false;
    }

    return pendingEmail === trimmedEmail && doesEmailExist === null;
  };

  return {
    authError,
    doesEmailExist,
    form,
    isEmailCheckPending,
    isChecking,
    isSignUp: doesEmailExist === false,
    onEmailChanged,
    resetEmailCheck,
    setAuthError,
    submit,
  };
};
