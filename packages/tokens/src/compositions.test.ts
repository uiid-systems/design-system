import { describe, expect, it } from "vitest";

// `?raw` rather than a disk read, for the reason palette.test.ts gives: no
// package here carries node typings, so a builtin import breaks the build.
import compositionsCss from "./compositions.css?raw";

/**
 * The test DOM evaluates no media queries, so the stylesheet text is the only
 * place the guard can be checked. Dialog, Popover, Tooltip, Menu, Select and
 * the combobox popups all open through `.composes-popup`.
 */
describe("compositions.css", () => {
  const popup =
    /\.composes-popup \{[\s\S]*?\n {2}\}\n/.exec(compositionsCss)?.[0] ?? "";
  const [base, motion = ""] = popup.split(
    "@media (prefers-reduced-motion: no-preference)",
  );

  it("scales a popup open and shut only when motion is allowed", () => {
    expect(base).not.toMatch(/transform: scale/);
    expect(base).not.toMatch(/transition:\s*transform/);
    expect(motion).toMatch(/transition:\s*transform /);
    expect(motion).toMatch(
      /transform: scale\(var\(--globals-transform-scale-down\)\);/,
    );
  });

  it("keeps the opacity fade under reduced motion", () => {
    expect(base).toMatch(
      /transition: opacity var\(--globals-transition-duration\)/,
    );
    expect(base).toMatch(/opacity: 0;/);
  });
});
