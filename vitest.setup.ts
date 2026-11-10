/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

import "@testing-library/jest-dom/vitest";
import { toBeDisabled } from "@testing-library/jest-dom/matchers";
import type { MatcherState } from "vitest";

/**
 * Passes when the user can't operate the element: it is natively disabled
 * (jest-dom's own rules, so a disabled `<fieldset>` still counts) or it or an
 * ancestor carries `aria-disabled="true"`, which ARIA applies to every
 * focusable descendant. A disabled `Button` stays focusable and only sets
 * `aria-disabled`, which jest-dom's `toBeDisabled()`, `toBeEnabled()` and the
 * DOM `.disabled` property all miss.
 */
function toBeDisabledForUser(this: MatcherState, element: Element) {
  const nativelyDisabled = toBeDisabled.call(this, element).pass;
  const ariaDisabled = element.closest('[aria-disabled="true"]') !== null;
  const pass = nativelyDisabled || ariaDisabled;

  return {
    pass,
    message: () =>
      [
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toBeDisabledForUser`,
          "element",
          "",
        ),
        "",
        `Received element ${pass ? "is" : "is not"} disabled for the user (native \`disabled\` or \`aria-disabled="true"\`):`,
        // A deep clone keeps the label, so a failure says which button it was.
        `  ${this.utils.printReceived(element.cloneNode(true))}`,
      ].join("\n"),
  };
}

expect.extend({ toBeDisabledForUser });
