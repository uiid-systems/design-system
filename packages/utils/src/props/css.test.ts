import { describe, it, expect } from "vitest";

import { stylePropsCss } from "./css";

describe("stylePropsCss", () => {
  const css = stylePropsCss();

  it("resolves flex from its raw var without a unit", () => {
    expect(css).toContain("[data-ui-flex] {\n    flex: var(--props-flex);");
  });

  it("writes wrap as a bare toggle", () => {
    expect(css).toContain("[data-ui-wrap] {\n    flex-wrap: wrap;");
  });

  it("keeps a child's own flex under an evenly parent", () => {
    expect(css).toContain("[data-ui-evenly] > :not([data-ui-flex]) {");
  });
});
