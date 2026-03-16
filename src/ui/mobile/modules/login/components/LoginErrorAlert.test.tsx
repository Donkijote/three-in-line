import { fireEvent } from "@testing-library/react-native";

import { renderMobile } from "@/test/mobile/render";

import { LoginErrorAlert } from "./LoginErrorAlert";

describe("LoginErrorAlert", () => {
  it("renders a normalized invalid-credentials message and closes", () => {
    const mockOnClose = jest.fn();
    const screen = renderMobile(
      <LoginErrorAlert
        error={new Error("Invalid credentials")}
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByText("Authentication failed")).toBeTruthy();
    expect(
      screen.getByText(
        "We couldn't get you into the arena. Please check your credentials and try again.",
      ),
    ).toBeTruthy();

    fireEvent.press(screen.getByText("Try again"));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("hides stack-like error details behind the generic fallback", () => {
    const screen = renderMobile(
      <LoginErrorAlert
        error={new Error("Boom\n at stack trace")}
        onClose={jest.fn()}
      />,
    );

    expect(
      screen.getByText("We couldn't get you into the arena. Please try again."),
    ).toBeTruthy();
  });
});
