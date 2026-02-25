import { describe, expect, it } from "vitest";

import {
  isValidEmail,
  resolveLoginSubmitState,
  validateAvatar,
  validateEmail,
  validatePassword,
} from "@/ui/shared/login/validators";

describe("login validators", () => {
  it("validates email format", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("invalid-email")).toBe(false);
  });

  it("returns email validation messages", () => {
    expect(validateEmail("")).toBe("Email is required");
    expect(validateEmail("foo")).toBe("Email is not valid");
    expect(validateEmail("foo@bar.com")).toBeUndefined();
  });

  it("validates password", () => {
    expect(validatePassword("")).toBe("Password is required");
    expect(validatePassword("12345", true)).toBe(
      "Password must be at least 6 characters",
    );
    expect(validatePassword("12345", false)).toBeUndefined();
    expect(validatePassword(" secret ")).toBeUndefined();
  });

  it("validates avatar", () => {
    expect(validateAvatar(undefined)).toBe("Avatar is required");
    expect(
      validateAvatar({ type: "preset", value: "avatar-1" }),
    ).toBeUndefined();
  });

  it("disables submit when email is invalid", () => {
    const state = resolveLoginSubmitState({
      values: { email: "invalid", password: "secret", flow: "signIn" },
      canSubmit: true,
      isSubmitting: false,
      isChecking: false,
      doesEmailExist: true,
      isEmailCheckPending: false,
    });

    expect(state.isDisabled).toBe(true);
  });

  it("disables submit when password is required but missing", () => {
    const state = resolveLoginSubmitState({
      values: { email: "user@example.com", password: "", flow: "signIn" },
      canSubmit: true,
      isSubmitting: false,
      isChecking: false,
      doesEmailExist: true,
      isEmailCheckPending: false,
    });

    expect(state.requirePassword).toBe(true);
    expect(state.isDisabled).toBe(true);
  });

  it("enables submit when conditions are valid", () => {
    const state = resolveLoginSubmitState({
      values: { email: "user@example.com", password: "secret", flow: "signIn" },
      canSubmit: true,
      isSubmitting: false,
      isChecking: false,
      doesEmailExist: true,
      isEmailCheckPending: false,
    });

    expect(state.isDisabled).toBe(false);
  });

  it("disables submit when sign up password is shorter than 6 characters", () => {
    const state = resolveLoginSubmitState({
      values: { email: "user@example.com", password: "12345", flow: "signUp" },
      canSubmit: true,
      isSubmitting: false,
      isChecking: false,
      doesEmailExist: false,
      isEmailCheckPending: false,
    });

    expect(state.requirePassword).toBe(true);
    expect(state.passwordValid).toBe(false);
    expect(state.isDisabled).toBe(true);
  });
});
