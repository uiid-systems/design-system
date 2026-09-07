import { PALETTE_HUES } from "./palette";

// Imported with the `?raw` suffix rather than read from disk, matching
// list.test.tsx: no package in this workspace carries node typings, so a
// builtin import breaks any package whose build runs `tsc`.
import paletteCss from "./palette.css?raw";

/**
 * `PALETTE_HUES` is derived from the token JSON, but `palette.css` is written by
 * hand — `palette.ts` notes in prose that a hue added to the JSON "needs a
 * matching block in palette.css to resolve to anything", and until this file
 * nothing enforced it. A hue that drifts does not throw; it publishes no
 * `--palette-*` names, and every component tinted with it silently falls back to
 * shade defaults.
 *
 * Deriving `--palette-tint-hover` added a second thing to keep in step: its
 * selector list cannot be hoisted to `:root` (custom properties substitute at
 * the element that declares them), so every hue has to be named there too.
 */

/** Comments name these tokens in prose, which would double every count. */
const SOURCE = paletteCss.replace(/\/\*[\s\S]*?\*\//g, "");

/**
 * Rules whose selector is entirely `.palette-*` classes. `[^}]*` is safe
 * because none of these bodies nest a block. Matching the `palette-` prefix
 * rather than a bare dot is what skips the `@layer uiid.tokens` wrapper, whose
 * own name contains one.
 */
const RULES = [
  ...SOURCE.matchAll(
    /((?:\s*\.palette-[a-z0-9-]+\s*,)*\s*\.palette-[a-z0-9-]+\s*)\{([^}]*)\}/g,
  ),
].map(([, selector, body]) => ({
  hues: selector.split(",").map((s) => s.trim().replace(/^\.palette-/, "")),
  body,
}));

/** The names a hue block publishes on its own, tint-hover excluded. */
const AUTHORED = [
  "--palette-fill",
  "--palette-on-fill",
  "--palette-fill-hover",
  "--palette-tint",
  "--palette-on-tint",
  "--palette-tint-border",
  "--palette-text",
];

const declares = (body: string, name: string) =>
  new RegExp(`${name}\\s*:`).test(body);

/** The one rule that derives tint-hover, whatever order it sits in. */
const derivation = RULES.find((r) => declares(r.body, "--palette-tint-hover"));

/** A hue's own block — the one that authors the per-hue values. */
const blockFor = (hue: string) =>
  RULES.find((r) => r.hues.length === 1 && r.hues[0] === hue);

describe("palette.css / PALETTE_HUES parity", () => {
  it("declares a block for every hue the token JSON defines", () => {
    const missing = PALETTE_HUES.filter((hue) => !blockFor(hue));
    expect(missing).toEqual([]);
  });

  it("declares no palette class for a hue the token JSON does not define", () => {
    const known = new Set<string>(PALETTE_HUES);
    const stray = [
      ...new Set(RULES.flatMap((r) => r.hues).filter((h) => !known.has(h))),
    ];
    expect(stray).toEqual([]);
  });

  it("publishes every authored name in every hue block", () => {
    const incomplete = PALETTE_HUES.flatMap((hue) => {
      const body = blockFor(hue)?.body ?? "";
      return AUTHORED.filter((name) => !declares(body, name)).map(
        (name) => `${hue}: ${name}`,
      );
    });
    expect(incomplete).toEqual([]);
  });
});

describe("palette.css derived --palette-tint-hover", () => {
  it("derives the token once rather than authoring it per hue", () => {
    const declarations = SOURCE.match(/--palette-tint-hover\s*:/g) ?? [];
    expect(declarations).toHaveLength(1);
  });

  /* Whitespace-stripped, because oxfmt decides whether the expression wraps. */
  it("mixes --shade-foreground into --palette-tint", () => {
    expect(derivation?.body.replace(/\s+/g, "")).toContain(
      "color-mix(inoklab,var(--shade-foreground)12%,var(--palette-tint))",
    );
  });

  it("names every hue in the derivation, since it cannot be hoisted to :root", () => {
    const missing = PALETTE_HUES.filter(
      (hue) => !derivation?.hues.includes(hue),
    );
    expect(missing).toEqual([]);
  });

  it("no longer authors tint-hover inside a hue block", () => {
    const authored = PALETTE_HUES.filter((hue) =>
      declares(blockFor(hue)?.body ?? "", "--palette-tint-hover"),
    );
    expect(authored).toEqual([]);
  });
});
