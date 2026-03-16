import { renderMobile } from "@/test/mobile/render";

import { LoginScreen } from "./LoginScreen";

jest.mock("@/ui/mobile/modules/login/components/LoginForm", () => {
  const { createTextStub } = require("@/test/mobile/componentMocks");

  return {
    LoginForm: createTextStub("login-form"),
  };
});

describe("LoginScreen", () => {
  it("renders the login hero copy and form", () => {
    const screen = renderMobile(<LoginScreen />);

    expect(screen.getByText("NEW\nGAME")).toBeTruthy();
    expect(
      screen.getByText("Enter the arena. Choose your identity."),
    ).toBeTruthy();
    expect(screen.getByText("login-form")).toBeTruthy();
  });
});
