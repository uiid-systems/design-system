import { describe, it, expect } from "vitest";

import { cx } from "./cva";

type State = { open: boolean };

const byState = (state: State) => (state.open ? "is-open" : "is-closed");

describe("cx", () => {
  it("merges strings, dictionaries and arrays", () => {
    expect(cx("a", { b: true, c: false }, ["d", { e: true }])).toBe("a b d e");
  });

  it("returns undefined when nothing is left", () => {
    expect(cx(false, null, undefined, "")).toBeUndefined();
  });

  it("rejects a function at the type level, since it cannot call one", () => {
    // @ts-expect-error a state function has no state to be called with here
    expect(cx("a", byState)).toBe("a");
    // @ts-expect-error nor inside an array
    expect(cx(["a", byState])).toBe("a");
  });
});
