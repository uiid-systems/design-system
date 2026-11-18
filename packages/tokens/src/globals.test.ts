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
  const globalsLayer = globalsCss.slice(layerStart);
  const controlRule = globalsLayer.match(
    /:is\(button, input, select, textarea\) \{([^}]*)\}/,
  )?.[1];

  it("declares uiid.globals as the lowest layer, below every component layer", () => {
    expect(globalsCss).toMatch(/^@layer uiid\.globals, /);
    expect(layerStart).toBeGreaterThan(0);
  });

  it("makes native form controls inherit the font family", () => {
    expect(controlRule).toBeDefined();
    expect(controlRule).toMatch(/font-family: inherit;/);
  });

  it("leaves control size, weight and line height alone", () => {
    // The `font` shorthand would reset all three, and controls that set no
    // font-size of their own (Tabs, Checkbox, Radio) would grow to body size.
    expect(controlRule).not.toMatch(/\bfont:/);
    expect(controlRule?.match(/[a-z-]+(?=:)/g)).toEqual(["font-family"]);
  });
});
