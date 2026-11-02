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

  it("writes full as a fallback chain after the numeric rule", () => {
    const rule =
      '[data-ui-w="full"] {\n    width: 100%;\n    width: -webkit-fill-available;\n    width: -moz-available;\n  }';
    expect(css).toContain(rule);
    expect(css.indexOf(rule)).toBeGreaterThan(css.indexOf("[data-ui-w] {"));
  });

  it("leaves -moz-available off the height keyword", () => {
    expect(css).toContain(
      '[data-ui-h="full"] {\n    height: 100%;\n    height: -webkit-fill-available;\n  }',
    );
  });

  it("sizes screen to the small viewport", () => {
    expect(css).toContain('[data-ui-minw="screen"] {\n    min-width: 100svw;');
    expect(css).toContain('[data-ui-maxh="screen"] {\n    max-height: 100svh;');
  });

  it("keeps margin auto", () => {
    expect(css).toContain('[data-ui-mx="auto"] {\n    margin-inline: auto;');
  });
});
