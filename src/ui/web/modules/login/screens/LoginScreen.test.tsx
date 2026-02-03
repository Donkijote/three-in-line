import { render, screen } from "@testing-library/react";

import { LoginScreen } from "./LoginScreen";

vi.mock("@/ui/web/modules/login/components/LoginForm", () => ({
  LoginForm: () => <div data-testid="login-form" />,
}));

describe("LoginScreen", () => {
  it("renders the headline and form", () => {
    render(<LoginScreen />);

    expect(
      screen.getByRole("heading", { name: /new\s*game/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Enter the arena. Choose your identity."),
    ).toBeInTheDocument();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});
