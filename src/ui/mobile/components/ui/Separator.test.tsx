import { renderMobile } from "@/test/mobile/render";

import { Separator } from "./separator";

describe("Separator", () => {
  it("renders horizontal and vertical separators", () => {
    const screen = renderMobile(
      <>
        <Separator />
        <Separator orientation="vertical" />
      </>,
    );

    expect(screen.toJSON()).toBeTruthy();
  });
});
