import { renderMobile } from "@/test/mobile/render";

import { Input } from "./input";

describe("Input", () => {
  it("applies disabled styling only when the input is not editable", () => {
    const screen = renderMobile(
      <>
        <Input placeholder="Enabled" />
        <Input editable={false} placeholder="Disabled" />
      </>,
    );

    expect(screen.getByPlaceholderText("Enabled").props.className).not.toContain(
      "opacity-50",
    );
    expect(screen.getByPlaceholderText("Disabled").props.className).toContain(
      "opacity-50",
    );
  });
});
