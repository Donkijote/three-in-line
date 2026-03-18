import { renderMobile } from "@/test/mobile/render";

import { FullPageLoader } from "./FullPageLoader";

describe("Mobile FullPageLoader", () => {
  it("renders the default label", () => {
    const screen = renderMobile(<FullPageLoader />);

    expect(screen.getByText("Loading")).toBeTruthy();
  });

  it("renders message and submessage when provided", () => {
    const screen = renderMobile(
      <FullPageLoader message="Please wait" subMessage="Almost there" />,
    );

    expect(screen.getByText("Please wait")).toBeTruthy();
    expect(screen.getByText("Almost there")).toBeTruthy();
  });
});
