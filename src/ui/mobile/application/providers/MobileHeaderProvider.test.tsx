import { Pressable, Text } from "react-native";

import { fireEvent } from "@testing-library/react-native";

import { renderMobile } from "@/test/mobile/render";

import { MobileHeaderProvider, useMobileHeader } from "./MobileHeaderProvider";

const HeaderConsumer = () => {
  const { header, setHeader } = useMobileHeader();

  return (
    <>
      <Text>{header?.title ?? "no-header"}</Text>
      <Pressable onPress={() => setHeader({ title: "Home", eyebrow: "Play" })}>
        <Text>set-header</Text>
      </Pressable>
      <Pressable onPress={() => setHeader(null)}>
        <Text>clear-header</Text>
      </Pressable>
    </>
  );
};

describe("MobileHeaderProvider", () => {
  it("throws when the hook is used outside the provider", () => {
    expect(() => renderMobile(<HeaderConsumer />)).toThrow(
      "useMobileHeader must be used within MobileHeaderProvider",
    );
  });

  it("stores and clears the current header", () => {
    const screen = renderMobile(
      <MobileHeaderProvider>
        <HeaderConsumer />
      </MobileHeaderProvider>,
    );

    expect(screen.getByText("no-header")).toBeTruthy();

    fireEvent.press(screen.getByText("set-header"));
    expect(screen.getByText("Home")).toBeTruthy();

    fireEvent.press(screen.getByText("clear-header"));
    expect(screen.getByText("no-header")).toBeTruthy();
  });
});
