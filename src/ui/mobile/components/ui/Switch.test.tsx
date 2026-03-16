import { renderMobile } from "@/test/mobile/render";

import { Switch } from "./switch";

describe("Switch", () => {
  it("renders checked and disabled switch states", () => {
    const screen = renderMobile(
      <>
        <Switch checked onCheckedChange={jest.fn()} />
        <Switch checked={false} disabled onCheckedChange={jest.fn()} />
      </>,
    );

    expect(screen.toJSON()).toBeTruthy();
  });
});
