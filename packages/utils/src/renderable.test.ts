import { describe, it, expect } from "vitest";

import { isRenderable } from "./renderable";

describe("isRenderable", () => {
  it("is false for what React renders as nothing", () => {
    expect(isRenderable(null)).toBe(false);
    expect(isRenderable(undefined)).toBe(false);
    expect(isRenderable(false)).toBe(false);
    expect(isRenderable(true)).toBe(false);
    expect(isRenderable("")).toBe(false);
  });

  it("counts 0, which React paints", () => {
    expect(isRenderable(0)).toBe(true);
  });

  it("looks into arrays", () => {
    expect(isRenderable([])).toBe(false);
    expect(isRenderable([null, false, [""]])).toBe(false);
    expect(isRenderable([null, "a"])).toBe(true);
  });

  it("counts anything it can't see into", () => {
    expect(isRenderable({ $$typeof: Symbol.for("react.lazy") })).toBe(true);
    expect(isRenderable(() => null)).toBe(true);
  });
});
