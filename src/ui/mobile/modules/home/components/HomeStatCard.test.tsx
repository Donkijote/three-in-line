import { renderMobile } from "@/test/mobile/render";

import { HomeStatCard } from "./HomeStatCard";

describe("HomeStatCard", () => {
  it("renders the home stat label and value", () => {
    const screen = renderMobile(
      <HomeStatCard accent="primary" label="Wins" value="12" />,
    );

    expect(screen.getByText("Wins")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
  });
});
