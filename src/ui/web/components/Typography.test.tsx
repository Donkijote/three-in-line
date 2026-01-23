import { render, screen } from "@testing-library/react";

import {
  Blockquote,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  InlineCode,
  Lead,
  Muted,
  P,
  Small,
} from "./Typography";

describe("Typography components", () => {
  it("renders the correct semantic tags", () => {
    render(
      <div>
        <H1 data-testid="h1">H1</H1>
        <H2 data-testid="h2">H2</H2>
        <H3 data-testid="h3">H3</H3>
        <H4 data-testid="h4">H4</H4>
        <H5 data-testid="h5">H5</H5>
        <H6 data-testid="h6">H6</H6>
        <P data-testid="p">P</P>
        <Lead data-testid="lead">Lead</Lead>
        <Blockquote data-testid="blockquote">Quote</Blockquote>
        <InlineCode data-testid="code">Code</InlineCode>
        <Small data-testid="small">Small</Small>
        <Muted data-testid="muted">Muted</Muted>
      </div>,
    );

    expect(screen.getByTestId("h1").tagName).toBe("H1");
    expect(screen.getByTestId("h2").tagName).toBe("H2");
    expect(screen.getByTestId("h3").tagName).toBe("H3");
    expect(screen.getByTestId("h4").tagName).toBe("H4");
    expect(screen.getByTestId("h5").tagName).toBe("H5");
    expect(screen.getByTestId("h6").tagName).toBe("H6");
    expect(screen.getByTestId("p").tagName).toBe("P");
    expect(screen.getByTestId("lead").tagName).toBe("P");
    expect(screen.getByTestId("blockquote").tagName).toBe("BLOCKQUOTE");
    expect(screen.getByTestId("code").tagName).toBe("CODE");
    expect(screen.getByTestId("small").tagName).toBe("SMALL");
    expect(screen.getByTestId("muted").tagName).toBe("P");
  });

  it("merges custom className with defaults", () => {
    render(
      <H3 data-testid="h3" className="custom-class">
        Heading
      </H3>,
    );

    expect(screen.getByTestId("h3")).toHaveClass("custom-class");
  });
});
