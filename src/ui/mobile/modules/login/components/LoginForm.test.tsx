import { fireEvent } from "@testing-library/react-native";

import { renderMobile } from "@/test/mobile/render";

import { LoginForm } from "./LoginForm";

const mockHandleSubmit = jest.fn();
const mockOnEmailChanged = jest.fn();
const mockSetAuthError = jest.fn();
const mockEmailHandleChange = jest.fn();
const mockEmailHandleBlur = jest.fn();
const mockPasswordHandleChange = jest.fn();
const mockPasswordHandleBlur = jest.fn();
const mockAvatarHandleChange = jest.fn();
const mockUseLoginFlow = jest.fn();

jest.mock("./AvatarOptions", () => {
  const React = require("react") as typeof import("react");
  const { Pressable, Text } =
    require("react-native") as typeof import("react-native");

  return {
    AvatarOptions: ({ onChange }: { onChange: (avatar: unknown) => void }) =>
      React.createElement(
        Pressable,
        {
          onPress: () =>
            onChange({
              id: "avatar-2",
              name: "Nova",
              initials: "N",
              src: "/avatars/avatar-2.svg",
            }),
        },
        React.createElement(Text, null, "avatar-options"),
      ),
  };
});

jest.mock("./LoginErrorAlert", () => {
  const React = require("react") as typeof import("react");
  const { Pressable, Text, View } =
    require("react-native") as typeof import("react-native");

  return {
    LoginErrorAlert: ({
      error,
      onClose,
    }: {
      error: unknown;
      onClose: () => void;
    }) =>
      React.createElement(
        View,
        null,
        React.createElement(Text, null, String(Boolean(error))),
        React.createElement(
          Pressable,
          { onPress: onClose },
          React.createElement(Text, null, "close-auth-error"),
        ),
      ),
  };
});

jest.mock("@/ui/shared/login/hooks/useLoginFlow", () => ({
  useLoginFlow: () => mockUseLoginFlow(),
}));

const createMockForm = ({
  canSubmit = true,
  isSubmitting = false,
  passwordErrors = [] as string[],
} = {}) => ({
  Field: ({
    children,
    name,
  }: {
    children: (field: {
      state: { value: unknown; meta: { errors: string[] } };
      handleBlur: () => void;
      handleChange: (value: unknown) => void;
    }) => React.ReactNode;
    name: "avatar" | "email" | "password";
  }) => {
    if (name === "email") {
      return children({
        state: { value: "player@example.com", meta: { errors: [] } },
        handleBlur: mockEmailHandleBlur,
        handleChange: mockEmailHandleChange,
      });
    }

    if (name === "password") {
      return children({
        state: { value: "secret123", meta: { errors: passwordErrors } },
        handleBlur: mockPasswordHandleBlur,
        handleChange: mockPasswordHandleChange,
      });
    }

    return children({
      state: {
        value: { type: "preset", value: "avatar-1" },
        meta: { errors: [] },
      },
      handleBlur: jest.fn(),
      handleChange: mockAvatarHandleChange,
    });
  },
  Subscribe: ({
    children,
    selector,
  }: {
    children: (value: {
      canSubmit: boolean;
      isSubmitting: boolean;
      values: {
        avatar: { type: string; value: string };
        email: string;
        password: string;
      };
    }) => React.ReactNode;
    selector: (state: {
      canSubmit: boolean;
      isSubmitting: boolean;
      values: {
        avatar: { type: string; value: string };
        email: string;
        password: string;
      };
    }) => {
      canSubmit: boolean;
      isSubmitting: boolean;
      values: {
        avatar: { type: string; value: string };
        email: string;
        password: string;
      };
    };
  }) =>
    children(
      selector({
        canSubmit,
        isSubmitting,
        values: {
          avatar: { type: "preset", value: "avatar-1" },
          email: "player@example.com",
          password: "secret123",
        },
      }),
    ),
  handleSubmit: mockHandleSubmit,
});

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles the sign-up flow fields and submission", () => {
    mockUseLoginFlow.mockReturnValue({
      authError: new Error("Invalid credentials"),
      doesEmailExist: false,
      form: createMockForm({ passwordErrors: ["Use 8+ characters"] }),
      isEmailCheckPending: jest.fn(() => false),
      isChecking: false,
      isSignUp: true,
      onEmailChanged: mockOnEmailChanged,
      setAuthError: mockSetAuthError,
    });

    const screen = renderMobile(<LoginForm />);

    fireEvent.changeText(
      screen.getByPlaceholderText("you@example.com"),
      "next@example.com",
    );
    fireEvent(screen.getByPlaceholderText("you@example.com"), "blur");
    fireEvent.changeText(
      screen.getByPlaceholderText("Enter password"),
      "next-password",
    );
    fireEvent(screen.getByPlaceholderText("Enter password"), "blur");
    fireEvent.press(screen.getByText("avatar-options"));
    fireEvent.press(screen.getByText("Sign up"));
    fireEvent.press(screen.getByText("close-auth-error"));

    expect(mockEmailHandleChange).toHaveBeenCalledWith("next@example.com");
    expect(mockOnEmailChanged).toHaveBeenCalledWith("next@example.com");
    expect(mockEmailHandleBlur).toHaveBeenCalledTimes(1);
    expect(mockPasswordHandleChange).toHaveBeenCalledWith("next-password");
    expect(mockPasswordHandleBlur).toHaveBeenCalledTimes(1);
    expect(mockAvatarHandleChange).toHaveBeenCalledWith({
      type: "preset",
      value: "avatar-2",
    });
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    expect(mockSetAuthError).toHaveBeenCalledWith(null);
    expect(screen.getByText("Use 8+ characters")).toBeTruthy();
  });

  it("hides password and avatar fields until the email state is known", () => {
    mockUseLoginFlow.mockReturnValue({
      authError: null,
      doesEmailExist: null,
      form: createMockForm(),
      isEmailCheckPending: jest.fn(() => true),
      isChecking: true,
      isSignUp: false,
      onEmailChanged: mockOnEmailChanged,
      setAuthError: mockSetAuthError,
    });

    const screen = renderMobile(<LoginForm />);

    expect(screen.queryByPlaceholderText("Enter password")).toBeNull();
    expect(screen.queryByText("avatar-options")).toBeNull();
    expect(screen.getByText("START GAME")).toBeTruthy();
  });
});
