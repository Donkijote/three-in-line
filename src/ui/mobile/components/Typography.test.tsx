import { renderMobile } from "@/test/mobile/render";

import {
  Blockquote,
  H1,
  H3,
  H5,
  InlineCode,
  Lead,
  Muted,
  P,
  Small,
} from "./Typography";

describe("Typography", () => {
  it("renders the mobile typography variants", () => {
    const screen = renderMobile(
      <>
        <H1>Heading one</H1>
        <H3>Heading three</H3>
        <H5>Heading five</H5>
        <P>Paragraph</P>
        <Lead>Lead</Lead>
        <Blockquote>Quote</Blockquote>
        <InlineCode>const a = 1;</InlineCode>
        <Small variant="label">Label</Small>
        <Muted>Muted</Muted>
      </>,
    );

    expect(screen.getByText("Heading one")).toBeTruthy();
    expect(screen.getByText("Heading three")).toBeTruthy();
    expect(screen.getByText("Heading five")).toBeTruthy();
    expect(screen.getByText("Paragraph")).toBeTruthy();
    expect(screen.getByText("Lead")).toBeTruthy();
    expect(screen.getByText("Quote")).toBeTruthy();
    expect(screen.getByText("const a = 1;")).toBeTruthy();
    expect(screen.getByText("Label")).toBeTruthy();
    expect(screen.getByText("Muted")).toBeTruthy();
  });
});
