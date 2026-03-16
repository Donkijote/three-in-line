import { renderMobile } from "@/test/mobile/render";

import { HomeSectionLabel } from "./HomeSectionLabel";

describe("HomeSectionLabel", () => {
  it("renders the centered section text", () => {
    const screen = renderMobile(<HomeSectionLabel text="Recent matches" />);

    expect(screen.getByText("Recent matches")).toBeTruthy();
  });
});
