import { renderMobile } from "@/test/mobile/render";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

describe("Card", () => {
  it("renders the full card compound API", () => {
    const screen = renderMobile(
      <Card>
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription>Content body</CardDescription>
        </CardContent>
        <CardFooter>
          <CardDescription>Footer body</CardDescription>
        </CardFooter>
      </Card>,
    );

    expect(screen.getByText("Card title")).toBeTruthy();
    expect(screen.getByText("Card description")).toBeTruthy();
    expect(screen.getByText("Content body")).toBeTruthy();
    expect(screen.getByText("Footer body")).toBeTruthy();
  });
});
