import { isValidElement } from "react";
import { describe, it, expect } from "vitest";

import { resolveTrigger } from "./trigger";

/**
 * The shape an element takes when it reaches development SSR lazily wrapped:
 * a `react.lazy` node whose `_init` hands back the element.
 */
const lazyElement = (element: React.ReactElement): React.ReactNode =>
  ({
    $$typeof: Symbol.for("react.lazy"),
    _payload: element,
    _init: (payload: unknown) => payload,
  }) as unknown as React.ReactNode;

describe("resolveTrigger", () => {
  it("uses an element as the trigger itself", () => {
    const trigger = <button type="button">Open</button>;
    const result = resolveTrigger(trigger);

    expect(result.render).toBe(trigger);
    expect(result.nativeButton).toBe(true);
  });

  it("wraps text in a focusable span", () => {
    const result = resolveTrigger("Open");

    expect(isValidElement(result.render)).toBe(true);
    expect((result.render as React.ReactElement).type).toBe("span");
    expect(result.nativeButton).toBe(false);
  });

  /*
   * Left wrapped, the server would take the lazy node for content and put it
   * inside a `role="button"` span, while the browser, which gets the plain
   * element, uses it as the trigger — and hydration disagrees.
   */
  it("uses a lazily wrapped element as the trigger itself", () => {
    const result = resolveTrigger(lazyElement(<button type="button" />));

    expect((result.render as React.ReactElement).type).toBe("button");
    expect(result.nativeButton).toBe(true);
  });

  it("leaves children to the caller's own render", () => {
    const children = lazyElement(<span />);
    expect(resolveTrigger(children, <a href="/x" />)).toEqual({ children });
  });
});
