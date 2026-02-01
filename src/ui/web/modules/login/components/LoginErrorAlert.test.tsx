import { fireEvent, render, screen } from "@testing-library/react";

import { LoginErrorAlert } from "./LoginErrorAlert";

describe("LoginErrorAlert", () => {
  it("renders a friendly message for invalid credentials", () => {
    render(
      <LoginErrorAlert
        error={new Error("Invalid credentials")}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByText(
        "We couldn't get you into the arena. Please check your credentials and try again.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the error message when provided", () => {
    render(<LoginErrorAlert error={new Error("Boom")} onClose={vi.fn()} />);

    expect(screen.getByText("Boom")).toBeInTheDocument();
  });

  it("calls onClose when the action button is clicked", () => {
    const onClose = vi.fn();

    render(<LoginErrorAlert error={new Error("Boom")} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(onClose).toHaveBeenCalled();
  });
});
