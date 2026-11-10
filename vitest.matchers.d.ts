/*
 * Types for the matchers `vitest.setup.ts` registers. Each package compiles
 * its tests with `tsc -b` from `src/`, where the setup file is out of reach,
 * so this declaration is listed in every package's `include` instead.
 */
import "vitest";

interface DisabledForUserMatchers<R> {
  /**
   * Use in place of jest-dom's `toBeDisabled()`, and `.not.toBeDisabledForUser()`
   * in place of `toBeEnabled()`. Reads native `disabled` and
   * `aria-disabled="true"` on the element or an ancestor.
   */
  toBeDisabledForUser(): R;
}

declare module "vitest" {
  interface Assertion<T = any> extends DisabledForUserMatchers<T> {}
  interface AsymmetricMatchersContaining extends DisabledForUserMatchers<any> {}
}
