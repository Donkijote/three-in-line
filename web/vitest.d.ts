import "vitest";

declare module "vitest" {
  interface Assertion<T = any> {
    not: Assertion<T>;
  }

  interface AsymmetricMatchersContaining {
    not: AsymmetricMatchersContaining;
  }
}
