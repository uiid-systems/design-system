import { describe, expect, it } from "vitest";

// `?raw` rather than a disk read, for the reason palette.test.ts gives: no
// package here carries node typings, so a builtin import breaks the build.
import globalsCss from "./globals.css?raw";

/**
 * The test DOM computes no real CSS, so the stylesheet text is the only place
 * these can be checked. Native form controls take their font from the browser
 * rather than their parent, so `body { font-family }` alone leaves every
 * button and input in the browser's control font (UI-387).
 */
describe("globals.css", () => {
  const layerStart = globalsCss.indexOf("@layer uiid.globals {");
  const globalsLayer = globalsCss
    .slice(layerStart)
    .replace(/\/\*[\s\S]*?\*\//g, "");

  // Flat `selector { declarations }` pairs. Nested blocks are skipped, which
  // is fine here: the control rule sits at the top level of the layer.
  const rules = [...globalsLayer.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(
    ([, selector, declarations]) => ({ selector, declarations }),
  );
  const controls = ["button", "input", "select", "textarea"];
  const controlRules = rules.filter(({ selector }) =>
    controls.every((tag) => new RegExp(`\\b${tag}\\b`).test(selector)),
  );

  it("declares uiid.globals as the lowest layer, below every component layer", () => {
    expect(globalsCss).toMatch(/^@layer uiid\.globals, /);
    expect(layerStart).toBeGreaterThan(0);
  });

  it("makes native form controls inherit the font family", () => {
    expect(
      controlRules.some(({ declarations }) =>
        /font-family:\s*inherit/.test(declarations),
      ),
    ).toBe(true);
  });

  it("does not reset control size, weight or line height with the font shorthand", () => {
    // The `font` shorthand would reset all three, and controls that set no
    // font-size of their own (Tabs, Checkbox, Radio) would grow to body size.
    expect(globalsLayer).not.toMatch(/(^|[\s;{])font:/);
  });

  describe("theming", () => {
    const rule = (pattern: RegExp) =>
      rules.find(({ selector }) => pattern.test(selector.trim()));

    it.each(["light", "dark"])(
      "lets any element, not only the root, set data-theme=%s",
      (scheme) => {
        const themed = rule(new RegExp(`^\\[data-theme="${scheme}"\\]$`));
        expect(themed?.declarations).toMatch(
          new RegExp(`color-scheme:\\s*${scheme}`),
        );
        expect(globalsLayer).not.toMatch(/:root\[data-theme/);
      },
    );

    // Body's colors are inherited as resolved values, so a nested themed
    // section has to resolve them again in its own scheme.
    it("repaints a nested themed section's text and background", () => {
      const nested = rule(/\[data-theme[^\]]*\][^{]*:not\(:root\)$/);
      expect(nested?.selector).toMatch(/data-theme="light"/);
      expect(nested?.selector).toMatch(/data-theme="dark"/);
      expect(nested?.declarations).toMatch(
        /background-color:\s*var\(--shade-background\)/,
      );
      expect(nested?.declarations).toMatch(
        /(^|[\s;])color:\s*var\(--shade-foreground\)/,
      );
    });
  });
});
