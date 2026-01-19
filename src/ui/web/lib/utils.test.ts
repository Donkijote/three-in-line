import { cn } from "./utils";

describe("cn", () => {
  it("joins class names and skips falsy values", () => {
    expect(cn("p-2", false, null, "text-sm")).toBe("p-2 text-sm");
  });

  it("merges tailwind utility conflicts", () => {
    expect(cn("px-2", "px-4", "text-sm", "text-base")).toBe("px-4 text-base");
  });

  it("accepts arrays and objects", () => {
    expect(
      cn(["rounded", "border"], {
        "text-foreground": true,
        "text-muted-foreground": false,
      }),
    ).toBe("rounded border text-foreground");
  });
});
