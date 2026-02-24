import type { ReactNode } from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import type { AvatarPreset } from "@/ui/shared/avatars";
import { validateAvatar, validatePassword } from "@/ui/shared/login/validators";

import { LoginForm } from "./LoginForm";

const signIn = vi.fn();
const checkEmailExists = vi.fn();
const debouncedCancel = vi.fn();
let debouncedCallback: ((value: string) => void) | null = null;
let isChecking = false;

vi.mock("@convex-dev/auth/react", () => ({
  useAuthActions: () => ({ signIn }),
}));

vi.mock("@/ui/shared/login/useCheckEmailExists", () => ({
  useCheckEmailExists: () => ({
    checkEmailExists,
    isChecking,
  }),
}));

vi.mock("use-debounce", () => ({
  useDebouncedCallback: (callback: (...args: unknown[]) => void) => {
    const fn = (...args: unknown[]) => callback(...args);
    fn.cancel = debouncedCancel;
    debouncedCallback = (value: string) => fn(value);
    return fn;
  },
}));

vi.mock("@/ui/web/modules/login/components/AvatarOptions", () => ({
  AvatarOptions: ({
    onChange,
  }: {
    onChange: (avatar: AvatarPreset) => void;
  }) => (
    <button
      type="button"
      onClick={() =>
        onChange({
          id: "avatar-1",
          name: "Test",
          initials: "T",
          src: "/avatars/avatar-1.svg",
        })
      }
    >
      Pick avatar
    </button>
  ),
}));

vi.mock("@/ui/web/components/AvatarMoreOptions", () => ({
  AvatarMoreOptions: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    signIn.mockReset();
    checkEmailExists.mockReset();
    debouncedCancel.mockReset();
    debouncedCallback = null;
    isChecking = false;
  });

  it("submits sign-in payload when email exists", async () => {
    checkEmailExists.mockResolvedValue(true);

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "player@example.com" },
    });

    await waitFor(() =>
      expect(checkEmailExists).toHaveBeenCalledWith("player@example.com"),
    );

    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "super-secret" },
    });

    fireEvent.click(screen.getByRole("button", { name: "START GAME" }));

    await waitFor(() =>
      expect(signIn).toHaveBeenCalledWith("password", {
        email: "player@example.com",
        password: "super-secret",
        flow: "signIn",
      }),
    );
  });

  it("validates the password requirement", () => {
    expect(validatePassword("")).toBe("Password is required");
    expect(validatePassword(" secret ")).toBeUndefined();
  });

  it("validates the avatar requirement", () => {
    expect(validateAvatar(undefined)).toBe("Avatar is required");
    expect(
      validateAvatar({ type: "preset", value: "avatar-1" }),
    ).toBeUndefined();
  });

  it("submits sign-up payload when email is new", async () => {
    checkEmailExists.mockResolvedValue(false);

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "new@example.com" },
    });

    await waitFor(() =>
      expect(checkEmailExists).toHaveBeenCalledWith("new@example.com"),
    );

    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "super-secret" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() =>
      expect(signIn).toHaveBeenCalledWith(
        "password",
        expect.objectContaining({
          email: "new@example.com",
          password: "super-secret",
          flow: "signUp",
        }),
      ),
    );
  });

  it("shows an alert when authentication fails", async () => {
    checkEmailExists.mockResolvedValue(true);
    signIn.mockRejectedValue(new Error("Invalid credentials"));

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "player@example.com" },
    });

    await waitFor(() =>
      expect(checkEmailExists).toHaveBeenCalledWith("player@example.com"),
    );

    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "bad-pass" },
    });

    fireEvent.click(screen.getByRole("button", { name: "START GAME" }));

    expect(
      await screen.findByText(
        "We couldn't get you into the arena. Please check your credentials and try again.",
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    await waitFor(() =>
      expect(
        screen.queryByText(
          "We couldn't get you into the arena. Please check your credentials and try again.",
        ),
      ).not.toBeInTheDocument(),
    );
  });

  it("short-circuits the email check when the debounced callback receives an empty value", () => {
    render(<LoginForm />);

    debouncedCallback?.("   ");

    expect(checkEmailExists).not.toHaveBeenCalled();
  });

  it("cancels the email check when the input is invalid", () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "nope" },
    });

    expect(debouncedCancel).toHaveBeenCalled();
    expect(checkEmailExists).not.toHaveBeenCalled();
  });

  it("renders the loading indicator while checking the email", () => {
    isChecking = true;

    const { container } = render(<LoginForm />);

    expect(container.querySelector("svg.lucide-loader")).toBeInTheDocument();
  });

  it("requires a password once the email is recognized", async () => {
    checkEmailExists.mockResolvedValue(true);

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "player@example.com" },
    });

    await waitFor(() =>
      expect(checkEmailExists).toHaveBeenCalledWith("player@example.com"),
    );

    const passwordInput = screen.getByPlaceholderText("Enter password");

    fireEvent.change(passwordInput, { target: { value: "" } });

    expect(screen.getByRole("button", { name: "START GAME" })).toBeDisabled();
  });

  it("marks the email field as required when cleared", async () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("you@example.com");

    fireEvent.change(emailInput, { target: { value: "player@example.com" } });
    fireEvent.change(emailInput, { target: { value: "" } });

    await waitFor(() => expect(debouncedCancel).toHaveBeenCalled());
  });

  it("updates the avatar field when a selection is made during sign up", async () => {
    checkEmailExists.mockResolvedValue(false);

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "new@example.com" },
    });

    await waitFor(() =>
      expect(checkEmailExists).toHaveBeenCalledWith("new@example.com"),
    );

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Sign up" }),
      ).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: "Pick avatar" }));

    expect(screen.getByDisplayValue("avatar-1")).toBeInTheDocument();
  });

  it("handles failures when checking email existence", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    checkEmailExists.mockRejectedValue(new Error("boom"));

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "player@example.com" },
    });

    await waitFor(() =>
      expect(consoleError).toHaveBeenCalledWith(
        "Failed to verify email",
        expect.any(Error),
      ),
    );

    consoleError.mockRestore();
  });
});
