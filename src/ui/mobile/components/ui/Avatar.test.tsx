import { Text } from "react-native";

import { act, fireEvent } from "@testing-library/react-native";

import { renderMobile } from "@/test/mobile/render";

import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./avatar";

jest.mock("@rn-primitives/avatar", () => {
  const React = require("react") as typeof import("react");
  const { Text, View } =
    require("react-native") as typeof import("react-native");

  return {
    Root: ({ children, ...props }: { children: React.ReactNode }) =>
      React.createElement(View, props, children),
    Image: ({
      source,
      ...props
    }: {
      source?: number | { uri?: string } | Array<{ uri?: string }>;
    }) => {
      const uri = Array.isArray(source)
        ? source.find((entry) => Boolean(entry?.uri))?.uri
        : typeof source === "number"
          ? "static-image"
          : source?.uri;

      return React.createElement(Text, props, uri ?? "image");
    },
    Fallback: ({ children, ...props }: { children: React.ReactNode }) =>
      React.createElement(View, props, children),
  };
});

describe("Avatar", () => {
  it("requires the avatar compound context", () => {
    expect(() =>
      renderMobile(<AvatarImage source={{ uri: "/avatars/avatar-1.png" }} />),
    ).toThrow(
      "Avatar compound components cannot be rendered outside the Avatar component",
    );
  });

  it("renders regular image sources and fallback content", () => {
    const screen = renderMobile(
      <Avatar alt="Player">
        <AvatarImage source={{ uri: "/avatars/avatar-1.png" }} />
        <AvatarFallback>
          <Text>AB</Text>
        </AvatarFallback>
        <AvatarBadge>
          <Text>badge</Text>
        </AvatarBadge>
      </Avatar>,
    );

    expect(
      screen.getByText("https://assets.example.com/avatars/avatar-1.png"),
    ).toBeTruthy();
    expect(screen.getByText("AB")).toBeTruthy();
    expect(screen.getByText("badge")).toBeTruthy();
  });

  it("handles empty, numeric, and plain object sources as non-svg images", () => {
    const screen = renderMobile(
      <>
        <Avatar alt="Player empty">
          <AvatarImage />
          <AvatarFallback>
            <Text>EMPTY</Text>
          </AvatarFallback>
        </Avatar>
        <Avatar alt="Player static">
          <AvatarImage source={1} />
          <AvatarFallback>
            <Text>STATIC</Text>
          </AvatarFallback>
        </Avatar>
        <Avatar alt="Player object">
          <AvatarImage source={{}} />
          <AvatarFallback>
            <Text>OBJECT</Text>
          </AvatarFallback>
        </Avatar>
      </>,
    );

    expect(screen.getAllByText("image")).toHaveLength(2);
    expect(screen.getByText("static-image")).toBeTruthy();
    expect(screen.getByText("EMPTY")).toBeTruthy();
    expect(screen.getByText("STATIC")).toBeTruthy();
    expect(screen.getByText("OBJECT")).toBeTruthy();
  });

  it("maps svg sources through the public asset resolver and hides the fallback after load", () => {
    const screen = renderMobile(
      <Avatar alt="Player">
        <AvatarImage
          source={[
            { uri: "/avatars/avatar-1.svg" },
            { uri: "/avatars/avatar-2.svg" },
          ]}
        />
        <AvatarFallback>
          <Text>SVG</Text>
        </AvatarFallback>
      </Avatar>,
    );

    const image = screen.getByText(
      "https://assets.example.com/avatars/avatar-1.svg",
    );

    expect(screen.getByText("SVG")).toBeTruthy();

    act(() => {
      fireEvent.press(image);
    });

    expect(screen.queryByText("SVG")).toBeNull();

    act(() => {
      fireEvent(image, "longPress");
    });

    expect(screen.getByText("SVG")).toBeTruthy();
    expect(
      screen.getByText("https://assets.example.com/avatars/avatar-1.svg"),
    ).toBeTruthy();
  });

  it("keeps array entries without uris untouched while mapping valid image uris", () => {
    const screen = renderMobile(
      <Avatar alt="Player array">
        <AvatarImage source={[{}, { uri: "/avatars/avatar-3.png" }]} />
        <AvatarFallback>
          <Text>ARRAY</Text>
        </AvatarFallback>
      </Avatar>,
    );

    expect(
      screen.getByText("https://assets.example.com/avatars/avatar-3.png"),
    ).toBeTruthy();
    expect(screen.getByText("ARRAY")).toBeTruthy();
  });
});
