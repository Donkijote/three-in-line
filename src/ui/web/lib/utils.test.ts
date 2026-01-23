import { cn, isValidEmail } from "./utils";

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

describe("isValidEmail", () => {
  it("accepts valid email addresses", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("first.last+tag@sub.domain.com")).toBe(true);
  });

  it("rejects invalid email addresses", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
    expect(isValidEmail("@example.com")).toBe(false);
    expect(isValidEmail("user@example")).toBe(false);
  });
});
