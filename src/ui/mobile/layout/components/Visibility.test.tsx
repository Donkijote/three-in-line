import { Text } from "react-native";

import { renderMobile } from "@/test/mobile/render";

import { Visibility } from "./Visibility";

describe("Visibility", () => {
  it("renders children only when visible", () => {
    const screen = renderMobile(
      <>
        <Visibility visible>
          <Text>visible-content</Text>
        </Visibility>
        <Visibility visible={false}>
          <Text>hidden-content</Text>
        </Visibility>
      </>,
    );

    expect(screen.getByText("visible-content")).toBeTruthy();
    expect(screen.queryByText("hidden-content")).toBeNull();
  });
});
