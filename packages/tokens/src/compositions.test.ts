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

/**
 * The paint of a highlighted row is measured in menu.browser.test.tsx. That
 * file does not emulate forced colors, so the forced-colors arm is checked
 * here, in the stylesheet text.
 */
describe("compositions.css .composes-option", () => {
  const option =
    /\.composes-option \{[\s\S]*?\n {2}\}\n/.exec(compositionsCss)?.[0] ?? "";
  const [, forced = ""] = option.split("@media (forced-colors: active)");

  it("paints the ring in Highlight under forced colors", () => {
    expect(forced).toMatch(
      /&:where\(\[data-highlighted\], :focus-visible\) \{[^}]*outline-color: Highlight;/,
    );
  });

  it("keeps a disabled row's ring at full strength under forced colors", () => {
    expect(forced).toMatch(
      /&:where\(\[data-disabled\]\) \{[^}]*opacity: 1;[^}]*color: GrayText;/,
    );
  });
});
