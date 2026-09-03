#!/usr/bin/env node
/**
 * Palette contrast + perceptual-separation check.
 *
 * `palette.css` claims in prose that "every pairing clears WCAG AA (4.5:1)
 * against the surface it is named for" and that "the tightest is 5.10:1".
 * Nothing checked that. This does, from the authored hex in the token JSON, so
 * a retune that breaks the claim fails here instead of in review.
 *
 * TWO instruments, deliberately:
 *
 *   WCAG contrast ratio — for text on a surface. AA is 4.5:1; the 3:1
 *   non-text threshold applies to borders.
 *
 *   ΔL* (CIE lightness delta) — for a surface sitting on another surface: a
 *   hover fill, an option highlight. WCAG ratio is the wrong instrument here.
 *   Every such pairing in this system lands between 1.08 and 1.50, which says
 *   nothing about whether the band is visible. ΔL* tracks what the eye does.
 *   The calibration point is the system's own: --shade-accent on the page
 *   background measures ΔL* 11.54 (light) / 10.53 (dark), so ~10 is "reads as
 *   a band" and single digits are progressively invisible.
 *
 * The ramps are the reason this matters. They are not perceptually uniform, so
 * "one step up" means something different at every hue: the tint→tint-hover
 * step ranges from ΔL* 2.77 (yellow, light) to 13.64 (neutral, light) for what
 * is nominally the same move. See docs/architecture/ui-194-list-and-option-theming.md.
 *
 * Usage:
 *   node scripts/check-palette-contrast.mjs            # summary + failures
 *   node scripts/check-palette-contrast.mjs --verbose  # every pairing, per hue
 *
 * Exits non-zero only if an AA text pairing falls below 4.5:1 — the claim the
 * file makes. Borders and ΔL* bands are reported as advisory, because both
 * turn on a judgement (does 1.4.11 apply to this border; is this band visible
 * enough) that a threshold in a script should inform rather than decide.
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const COLORS = resolve(
  ROOT,
  "packages/tokens/src/json/primitives/colors.tokens.json",
);

const VERBOSE = process.argv.includes("--verbose");

/* -------------------------------------------------------------------------- */
/* Colour maths                                                               */
/* -------------------------------------------------------------------------- */

const srgbChannels = (hex) => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
};

/** sRGB → linear-light. The 0.04045 knee is the sRGB transfer function's. */
const toLinear = (c) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

/** Relative luminance, per WCAG 2.x. */
const luminance = (hex) => {
  const [r, g, b] = srgbChannels(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG contrast ratio. Order-independent. */
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** CIE L*, the perceptual lightness axis. */
const lightness = (hex) => {
  const y = luminance(hex);
  return y > 0.008856 ? 116 * y ** (1 / 3) - 16 : 903.3 * y;
};

const deltaL = (a, b) => Math.abs(lightness(a) - lightness(b));

/* -------------------------------------------------------------------------- */
/* Token model                                                                */
/* -------------------------------------------------------------------------- */

const colors = JSON.parse(readFileSync(COLORS, "utf8")).color;

/**
 * A hue *is* a ramp — an entry carrying a `500` step. Testing for that step is
 * what keeps DTCG group metadata (`$type`, `$description`) and the bare
 * white/black values out. Mirrors PALETTE_HUES in palette.ts, deliberately: if
 * these two ever disagree, this script is measuring a different set than the
 * one that ships.
 */
const HUES = Object.entries(colors)
  .filter(([, v]) => v && typeof v === "object" && "500" in v)
  .map(([hue]) => hue);

const step = (hue, s) => colors[hue][s].$value;

/** Light index 0, dark index 1 — matching light-dark() argument order. */
const SCHEMES = ["light", "dark"];

/** --shade-foreground, from json/semantic/shade.tokens.json. */
const SHADE = {
  background: ["#fefefa", "#0d0d0d"],
  surface: ["#eaeae7", "#1a1a1a"],
  accent: ["#ddddd9", "#242423"],
  muted: ["#464645", "#b2b1af"],
  foreground: ["#0d0d0d", "#fefefa"],
};

/**
 * The treatments each hue block in palette.css publishes. Neutral's tint is a
 * literal #ffffff rather than neutral-50 — it is the one hue whose tinted card
 * is meant to read as "paper", not as a tinted surface.
 */
const treatment = (hue, m) => ({
  fill: step(hue, m === 0 ? "700" : "400"),
  onFill: step(hue, m === 0 ? "50" : "950"),
  fillHover: step(hue, m === 0 ? "800" : "300"),
  tint:
    hue === "neutral" && m === 0
      ? "#ffffff"
      : step(hue, m === 0 ? "50" : "900"),
  onTint: step(hue, m === 0 ? "800" : "200"),
  tintHover: step(hue, m === 0 ? "100" : "800"),
  tintBorder: step(hue, m === 0 ? "200" : "700"),
  text: step(hue, m === 0 ? "700" : "400"),
});

/* -------------------------------------------------------------------------- */
/* Checks                                                                     */
/* -------------------------------------------------------------------------- */

const AA = 4.5;
const NON_TEXT = 3.0;

/**
 * The ΔL* floor for a surface-on-surface band, calibrated on --shade-accent
 * against the page (11.54 light / 10.53 dark) — the treatment .composes-option
 * replaced. Advisory: reported, but does not fail the run, because it is a
 * design judgement rather than a standard.
 */
const BAND_FLOOR = 8;

const results = [];
const record = (r) => results.push(r);

for (let m = 0; m < 2; m++) {
  const scheme = SCHEMES[m];
  for (const hue of HUES) {
    const t = treatment(hue, m);

    // Text on the surface each pairing is named for. This is the claim
    // palette.css makes in its header comment.
    record({
      scheme,
      hue,
      kind: "aa",
      name: "on-fill / fill",
      v: contrast(t.onFill, t.fill),
      min: AA,
    });
    record({
      scheme,
      hue,
      kind: "aa",
      name: "on-tint / tint",
      v: contrast(t.onTint, t.tint),
      min: AA,
    });
    record({
      scheme,
      hue,
      kind: "aa",
      name: "text / page",
      v: contrast(t.text, SHADE.background[m]),
      min: AA,
    });

    // Hover must not degrade the pairing it carries — the surface moves, the
    // foreground on it does not.
    record({
      scheme,
      hue,
      kind: "aa",
      name: "on-fill / fill-hover",
      v: contrast(t.onFill, t.fillHover),
      min: AA,
    });
    record({
      scheme,
      hue,
      kind: "aa",
      name: "on-tint / tint-hover",
      v: contrast(t.onTint, t.tintHover),
      min: AA,
    });

    // The border is non-text. Advisory, not a gate: whether 1.4.11's 3:1
    // applies depends on the border's job. On a Card it is decorative — the
    // tint delineates the surface — but on a coloured input it *is* the
    // component boundary, which is 1.4.11's canonical example.
    //
    // Reported rather than failed because this is systemic and predates the
    // palette: --globals-border-color is {shade.accent}, so an UNCOLOURED
    // input's border measures 1.35:1 (light) / 1.25:1 (dark) against the page.
    // The palette's borders sit in the same band, so `color` introduced
    // nothing. Raising the floor is a system-wide decision, not this file's.
    record({
      scheme,
      hue,
      kind: "border",
      name: "tint-border / tint",
      v: contrast(t.tintBorder, t.tint),
      min: NON_TEXT,
    });
    record({
      scheme,
      hue,
      kind: "border",
      name: "tint-border / page",
      v: contrast(t.tintBorder, SHADE.background[m]),
      min: NON_TEXT,
    });

    // UI-194: chrome that is still on shade tokens, measured against the
    // TINTED popup surface rather than the page. This is the check the
    // palette's own pairings do not cover.
    record({
      scheme,
      hue,
      kind: "aa",
      name: "shade-muted / tint",
      v: contrast(SHADE.muted[m], t.tint),
      min: AA,
    });
    record({
      scheme,
      hue,
      kind: "aa",
      name: "shade-muted / tint-hover",
      v: contrast(SHADE.muted[m], t.tintHover),
      min: AA,
    });
    record({
      scheme,
      hue,
      kind: "aa",
      name: "shade-foreground / tint",
      v: contrast(SHADE.foreground[m], t.tint),
      min: AA,
    });

    // Perceptual separation. Not WCAG — see the header.
    record({
      scheme,
      hue,
      kind: "band",
      name: "tint-hover on tint",
      v: deltaL(t.tintHover, t.tint),
      min: BAND_FLOOR,
    });
    record({
      scheme,
      hue,
      kind: "band",
      name: "fill-hover on fill",
      v: deltaL(t.fillHover, t.fill),
      min: BAND_FLOOR,
    });
  }
}

/* -------------------------------------------------------------------------- */
/* Report                                                                     */
/* -------------------------------------------------------------------------- */

const fmt = (n) => n.toFixed(2).padStart(6);
const isBand = (r) => r.kind === "band";

if (VERBOSE) {
  for (const scheme of SCHEMES) {
    console.log(`\n${scheme.toUpperCase()}`);
    const names = [
      ...new Set(results.filter((r) => r.scheme === scheme).map((r) => r.name)),
    ];
    for (const name of names) {
      const rows = results.filter(
        (r) => r.scheme === scheme && r.name === name,
      );
      const unit = isBand(rows[0]) ? "ΔL*" : ":1";
      const detail = rows.map((r) => `${r.hue}=${r.v.toFixed(1)}`).join(" ");
      console.log(`  ${name.padEnd(26)} ${unit.padEnd(4)} ${detail}`);
    }
  }
}

/*
 * Only the AA text pairings gate the run. That is the claim palette.css makes
 * in prose — "every pairing clears WCAG AA (4.5:1) against the surface it is
 * named for ... the tightest is 5.10:1" — and the one thing a retune must not
 * silently break. Borders and perceptual bands are reported as advisory: both
 * involve a judgement (does 1.4.11 apply to this border; is this band visible
 * enough) that a threshold in a script should inform rather than decide.
 */
const failures = results.filter((r) => r.kind === "aa" && r.v < r.min);
const weak = results.filter((r) => isBand(r) && r.v < r.min);

console.log("\nWCAG AA — text on the surface it is named for (gates this run)");
for (const scheme of SCHEMES) {
  const rows = results.filter((r) => r.scheme === scheme && r.kind === "aa");
  const worst = rows.reduce((a, b) => (b.v < a.v ? b : a));
  console.log(
    `  ${scheme.padEnd(6)} ${rows.length} pairings, tightest ${fmt(worst.v)}  (${worst.name}, ${worst.hue})`,
  );
}

console.log(
  "\nNon-text borders (advisory — see the note at the border checks)",
);
for (const scheme of SCHEMES) {
  const rows = results.filter(
    (r) => r.scheme === scheme && r.kind === "border",
  );
  const lo = rows.reduce((a, b) => (b.v < a.v ? b : a));
  const hi = rows.reduce((a, b) => (b.v > a.v ? b : a));
  const under = rows.filter((r) => r.v < NON_TEXT).length;
  console.log(
    `  ${scheme.padEnd(6)} ${fmt(lo.v)} (${lo.hue}, ${lo.name}) .. ${fmt(hi.v)} (${hi.hue})` +
      `  ${under}/${rows.length} below ${NON_TEXT}:1`,
  );
}

console.log(
  "\nPerceptual separation — surface on surface (ΔL*, advisory floor 8)",
);
for (const scheme of SCHEMES) {
  for (const name of ["tint-hover on tint", "fill-hover on fill"]) {
    const rows = results.filter((r) => r.scheme === scheme && r.name === name);
    const lo = rows.reduce((a, b) => (b.v < a.v ? b : a));
    const hi = rows.reduce((a, b) => (b.v > a.v ? b : a));
    const flag = lo.v < BAND_FLOOR ? "  <- below floor" : "";
    console.log(
      `  ${scheme.padEnd(6)} ${name.padEnd(20)} ${fmt(lo.v)} (${lo.hue}) .. ${fmt(hi.v)} (${hi.hue})` +
        `  spread ${(hi.v - lo.v).toFixed(2)}${flag}`,
    );
  }
}

if (weak.length) {
  console.log(
    `\n${weak.length} surface pairing(s) below the ΔL* floor of ${BAND_FLOOR} (advisory):`,
  );
  for (const r of weak.sort((a, b) => a.v - b.v)) {
    console.log(
      `  ${r.scheme.padEnd(6)} ${r.hue.padEnd(8)} ${r.name.padEnd(20)} ΔL* ${r.v.toFixed(2)}`,
    );
  }
}

if (failures.length) {
  console.log(`\nFAIL — ${failures.length} pairing(s) below threshold:`);
  for (const r of failures.sort((a, b) => a.v - b.v)) {
    console.log(
      `  ${r.scheme.padEnd(6)} ${r.hue.padEnd(8)} ${r.name.padEnd(26)} ${r.v.toFixed(2)}:1 < ${r.min}:1`,
    );
  }
  process.exit(1);
}

console.log("\nOK — every WCAG pairing clears its threshold.");
