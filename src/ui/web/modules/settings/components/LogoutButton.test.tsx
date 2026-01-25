import { fireEvent, render, screen } from "@testing-library/react";

import { LogoutButton } from "./LogoutButton";

const signOut = vi.fn();

vi.mock("@convex-dev/auth/react", () => ({
  useAuthActions: () => ({ signOut }),
}));

describe("LogoutButton", () => {
  it("calls signOut when clicked", () => {
    render(<LogoutButton />);

    fireEvent.click(screen.getByRole("button", { name: "Log Out" }));
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
