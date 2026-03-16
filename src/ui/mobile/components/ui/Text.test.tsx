import { Text as RNText } from "react-native";

import { renderMobile } from "@/test/mobile/render";

import { Text } from "./text";

jest.mock("@rn-primitives/slot", () => {
  const React = require("react") as typeof import("react");

  return {
    Text: ({
      children,
      ...props
    }: {
      children: React.ReactElement;
    }) => React.cloneElement(children, props),
  };
});

describe("Text", () => {
  it("renders default and heading variants with the expected accessibility props", () => {
    const screen = renderMobile(
      <>
        <Text>Body</Text>
        <Text variant="h1">Heading</Text>
      </>,
    );

    expect(screen.getByText("Body").props.role).toBeUndefined();
    expect(screen.getByText("Heading").props.role).toBe("heading");
    expect(screen.getByText("Heading").props["aria-level"]).toBe("1");
  });

  it("supports the asChild branch", () => {
    const screen = renderMobile(
      <Text asChild variant="blockquote">
        <RNText>Quote</RNText>
      </Text>,
    );

    expect(screen.getByText("Quote")).toBeTruthy();
  });
});
