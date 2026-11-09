import { describe, expect, it } from "vitest";

// `?raw` rather than a disk read, for the reason palette.test.ts gives: no
// package here carries node typings, so a builtin import breaks the build.
import animationsCss from "./animations.css?raw";

/**
 * jsdom neither runs keyframes nor evaluates media queries, so the stylesheet
 * text is the only place the guard can be checked. The Tool README promised
 * the running spinner stops under `prefers-reduced-motion` before anything
 * made it true; this keeps the two from drifting apart again.
 */
describe("animations.css", () => {
  it("stops the spin animation under prefers-reduced-motion", () => {
    expect(animationsCss).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{\s*\[data-animate="spin"\] \{\s*animation: none;\s*\}\s*\}/,
    );
  });
});
