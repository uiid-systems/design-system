import { describe, it, expect } from "vitest";

import { cx, cxState } from "./cva";

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

/** Calls the result as Base UI would: a function with the state, a string as is. */
const resolve = (className: ReturnType<typeof cxState<State>>, state: State) =>
  typeof className === "function" ? className(state) : className;

describe("cxState", () => {
  it("resolves a state function with the part's state", () => {
    const className = cxState("module", byState);
    expect(resolve(className, { open: true })).toBe("module is-open");
    expect(resolve(className, { open: false })).toBe("module is-closed");
  });

  it("returns a plain string when no argument is a function", () => {
    // A function prop cannot cross into a client component, so a part
    // composed in a server component must still get a string.
    expect(cxState("module", "caller", { active: true })).toBe(
      "module caller active",
    );
  });

  it("keeps argument order, so the caller's class wins a conflict", () => {
    expect(
      resolve(
        cxState<State>("p-2", () => "p-4"),
        { open: true },
      ),
    ).toBe("p-4");
  });

  it("resolves every function argument, not only the last", () => {
    const className = cxState<State>(
      () => "first",
      "middle",
      (state) => (state.open ? "last" : undefined),
    );
    expect(resolve(className, { open: true })).toBe("first middle last");
    expect(resolve(className, { open: false })).toBe("first middle");
  });

  it("returns undefined when nothing is left", () => {
    expect(cxState(undefined, false)).toBeUndefined();
    expect(
      resolve(
        cxState<State>(undefined, () => undefined),
        { open: true },
      ),
    ).toBeUndefined();
  });
});
