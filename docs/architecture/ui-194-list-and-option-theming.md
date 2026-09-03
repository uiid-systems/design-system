# Theming Lists and Option Surfaces on Palette Tokens

**Date:** 2026-09-02
**Status:** Spike complete; recommendation below, implementation not started
**Ticket:** [UI-194](https://linear.app/uiid/issue/UI-194/spike-theming-lists-and-option-surfaces-on-palette-tokens)
**Follows:** UI-184 (#371), which brought the palette `color` prop to dropdown popups
**Reproduce:** `node scripts/check-palette-contrast.mjs --verbose`

## Why

UI-184 tinted the dropdown _popup_ cheaply — it renders a `Card`, `Card` takes `color`, so
the surface was a prop pass-through. It also pointed `.composes-option`'s highlight at
`--palette-tint-hover`. What it skipped was the contrast budget for that shortcut, and
everything else inside the popup: the selected-item indicator, the group labels, and
`@uiid/lists`, which has no palette treatment at all.

Every number below is computed from the authored hex in
`packages/tokens/src/json/primitives/colors.tokens.json` by
`scripts/check-palette-contrast.mjs`, which this spike also lands. Nothing here is an
impression.

### Two instruments, on purpose

**WCAG contrast ratio** for text on a surface — AA is 4.5:1, non-text is 3:1.

**ΔL\*** (CIE lightness delta) for a surface sitting on another surface: a hover fill, an
option highlight. WCAG ratio is the wrong instrument there. Every such pairing in this
system lands between 1.08 and 1.50, which distinguishes nothing. The calibration point is
the system's own: `--shade-accent` on the page background measures **ΔL\* 11.54 light /
10.53 dark** — the treatment `.composes-option` replaced. So ~10 reads as a band, and
single digits are progressively invisible.

## What is _not_ broken (verified — don't chase these)

- **No text pairing fails AA on a tinted popup.** At any hue, in either scheme. The
  tightest in the entire matrix is 4.97:1 (`--shade-muted` on dark yellow's tint-hover).
  The ticket's worry that popup chrome "has to clear AA against the tinted popup surface"
  is already satisfied — `--shade-muted` and `--shade-foreground` sit near one end of the
  lightness axis and the tints near the other, so tinting never squeezes them.

  | Pairing                                    | Light       | Dark        |
  | ------------------------------------------ | ----------- | ----------- |
  | `--palette-on-tint` on the highlighted row | 8.33–10.59  | 7.68–8.22   |
  | `--shade-muted` on `--palette-tint`        | 7.84–9.45   | 7.49–8.47   |
  | `--shade-muted` on the highlighted row     | 6.41–7.39   | 4.97–7.21   |
  | `--shade-foreground` on `--palette-tint`   | 16.13–19.44 | 15.86–17.96 |

- **`.select-item-indicator` is already hue-aware.** `select.module.css:55` sets only
  `flex-shrink`/`height`/`width`; the `CheckIcon` inherits `currentColor`, which `Card` sets
  to `--palette-on-tint`. It tracks the hue today. The ticket lists it as unthemed — it
  isn't, and no work is needed.

- **`palette.css`'s own accuracy claim holds.** Its header states the tightest pairing is
  5.10:1. The script reproduces exactly that — light yellow, `on-fill` on `fill`.

- **Coloured borders are no worse than uncoloured ones.** `--palette-tint-border` measures
  1.17–3.21:1 against the surface it borders, which is below the 3:1 non-text threshold
  nearly everywhere. But `--globals-border-color` is `{shade.accent}`, so an _uncoloured_
  input's border measures 1.35:1 (light) / 1.25:1 (dark). The condition is systemic and
  predates the palette; `color` introduced nothing. See [Adjacent findings](#adjacent-findings).

## Finding 1 — the highlight is the real defect

Measured as ΔL\* between the highlighted row and the popup surface beneath it:

| Scheme | Range            | Weakest       | Baseline |
| ------ | ---------------- | ------------- | -------- |
| Light  | **2.77 – 13.64** | yellow (2.77) | ~11.5    |
| Dark   | 7.32 – 13.41     | indigo (7.32) | ~10.5    |

Six of eight hues in light mode fall below the baseline. Yellow at 2.77 is effectively
invisible — the highlighted option does not read as highlighted.

The cause is structural: **the ramps are not perceptually uniform**, so "one step up" means
something different at every hue. And stepping harder does not rescue it. Moving dark mode
to the `700` step lifts ΔL\* to 16–29, but drives the highlighted row's own label to
**4.37:1 at yellow — below AA**, with orange (4.70) and green (4.74) grazing it. There is
no single ramp step that is both visible and safe.

## Finding 2 — the same disease runs through every hover value

If the highlight is going to be derived rather than hand-picked, the question is whether
every hover value should be. Measured, as ΔL\*:

| Family                | Light spread           | Dark spread           |
| --------------------- | ---------------------- | --------------------- |
| `tint` → `tint-hover` | 2.77–13.64 (**10.86**) | 7.32–13.41 (**6.09**) |
| `fill` → `fill-hover` | 8.76–15.42 (**6.66**)  | 3.61–10.69 (**7.08**) |

None are uniform. Dark yellow's `fill-hover` is ΔL\* 3.61 — as near-invisible as the tint
case, on every filled Button and Badge in that hue.

## Finding 3 — derivation fixes tint, and cannot fix fill

Deriving hover as `color-mix(in oklab, var(--shade-foreground) N%, <surface>)`:

|            | tint-hover @ 12%              | fill-hover @ 26%             |
| ---------- | ----------------------------- | ---------------------------- |
| Light ΔL\* | 10.71–11.53 (spread **0.82**) | 5.26–10.15 (spread **4.90**) |
| Dark ΔL\*  | 10.29–11.63 (spread **1.34**) | 4.97–11.92 (spread **6.95**) |
| Worst AA   | 6.71                          | 7.42                         |

**Tint converges. Fill does not** — 4.90/6.95 is no better than the 6.66/7.08 it would
replace.

The reason is in the ramps, not the method. The tint anchors (`50` in light, `900` in dark)
are lightness-matched across hues, so a fixed proportional mix moves them all equally. The
fill anchors are not: `yellow-700` (#7a5f00) and `purple-700` (#56008f) differ substantially
in lightness, so the same mix produces different ΔL\*. **Derivation cannot fix an
uncalibrated base.**

A chroma-preserving alternative, `oklch(from <surface> calc(l + S) c h)`, was also measured.
It gives the tightest tint uniformity of anything tested — spread **0.06** in light — but
pushes **seven of eight hues outside the sRGB gamut** for fill, leaving the result to
per-engine gamut mapping. Rejected on that basis.

## Finding 4 — the hue-blind chrome is pinned, not merely un-themed

Two places hard-code a shade token, which is what keeps them from tracking the hue:

- `packages/lists/src/list/subcomponents/list-item.tsx:38` — the icon carries
  `style={{ color: "var(--shade-foreground)" }}`. That inline style also violates the
  inline-style ban in `.agents/styling.md` outright, as does a second one
  (`style={{ listStyleType: "none" }}`) on the wrapping `Group` at line 30.
- `packages/forms/src/shared/popup-layer/popup-layer.tsx` — `PopupLayerGroupLabel` passes
  `shade="muted"` to `Text`.

Per [What is not broken](#what-is-not-broken-verified--dont-chase-these), neither is an
accessibility failure. They are consistency defects, which lowers their urgency and changes
what a fix must prove: it must not regress the uncoloured case.

## Recommendation

### R1 — Derive `--palette-tint-hover`; the highlight fixes itself

Replace eight hand-authored declarations with one derivation:

```css
/* palette.css — one rule, alongside the per-hue blocks. */
.palette-red,
.palette-orange,
.palette-yellow,
.palette-green,
.palette-blue,
.palette-indigo,
.palette-purple,
.palette-neutral {
  --palette-tint-hover: color-mix(
    in oklab,
    var(--shade-foreground) 12%,
    var(--palette-tint)
  );
}
```

- **`.composes-option` needs no change at all.** It already reads `--palette-tint-hover`, so
  UI-194's defect closes as a side effect of the consistency work — no special case for
  options.
- **Established idiom.** `packages/tables/src/table/table.module.css:77` already derives
  Table's row hover as `color-mix(in oklab, var(--shade-foreground) 4%, transparent)`. This
  is the same rule at a different weight.
- **The `light-dark()` nesting is already proven.** `--shade-foreground` _is_ a
  `light-dark()` (`build-tokens.js:99`), and Table mixes it in shipped CSS today. One
  expression covers both schemes — foreground is black in light and white in dark, and hover
  moves toward it in both.
- **The selector list is load-bearing.** Custom properties substitute at the element that
  _declares_ them, so hoisting this to `:root` would resolve `var(--palette-tint)` where it
  is undefined and yield the guaranteed-invalid value. It must sit on the palette classes.

Mixing toward `--palette-on-tint` instead also converges (light spread 1.71, dark 0.71,
worst AA 7.22) and desaturates less. `--shade-foreground` is recommended because it matches
the Table precedent and makes hover _one_ rule across the system rather than one for the
palette and another for neutral surfaces.

### R2 — Leave `--palette-fill-hover` hand-authored

Per Finding 3, derivation gains nothing and would trade eight explicit values for an
expression that only looks principled. The genuine defect is that the `700`/`400` steps are
not lightness-calibrated across hues — a ramp-calibration ticket with blast radius across
every filled Button and Badge. File it separately with these measurements; **do not fold it
into UI-194.**

### R3 — The popup scopes list theming; `@uiid/lists` stays neutral

Follow the pattern `.composes-control-fill-color` already establishes in `compositions.css`
— deliberately generic names, read with the shade fallback each already uses, so an
uncoloured consumer resolves exactly as it does today:

```css
/* packages/lists/src/list/list.module.css — reads names it does not own. */
.list-text-description {
  color: var(--list-description-color, var(--shade-muted));
}
.list-item svg {
  color: var(--list-icon-color, var(--shade-foreground));
}
```

```css
/* The popup publishes them for its subtree; the hue stops at that boundary. */
.popup-layer-popup,
.select-popup {
  --list-description-color: var(--palette-on-tint);
  --list-icon-color: var(--palette-on-tint);
}
```

`@uiid/lists` is a structural package, and a `List` is not inherently a themed surface.
Giving it a `color` prop would couple it to the palette for one consumer that already owns a
themed boundary. Scoping keeps the dependency pointing the right way and makes the
uncoloured path zero-diff by construction.

`PopupLayerGroupLabel` is the same problem in TSX: it should drop `shade="muted"` and take
its colour from the scoped var like everything else.

### R4 — Remove the inline styles in `list-item.tsx`

Both `style={{}}` usages violate `.agents/styling.md`, and the one on line 38 is precisely
what makes the icon un-themeable. Moving the colour into `list.module.css` is a prerequisite
for R3, not a separate cleanup.

### R5 — `scripts/check-palette-contrast.mjs` (landed with this spike)

Gates on the claim `palette.css` makes in prose — every text pairing clears AA against the
surface it is named for — and reports borders and ΔL\* bands as advisory, since both involve
a judgement a threshold should inform rather than decide. Exits 0 on `main` today.

## Adjacent findings

Real, but outside UI-194. Recorded so they are not rediscovered.

- **Non-text contrast on form-control borders.** `--palette-tint-border` is 1.17–3.21:1
  against the surface it borders. On a `Card` the border is decorative — the tint delineates
  the surface — but on a coloured input it _is_ the component boundary, which is WCAG
  1.4.11's canonical example. Not a regression: the uncoloured default
  (`{shade.accent}`) measures 1.25–1.35:1, so the whole system sits in this band. Raising
  the floor is a system-wide accessibility decision.
- **`palette.css` and `PALETTE_HUES` can drift.** `palette.ts` notes in prose that a hue
  added to the token JSON "needs a matching block in `palette.css` to resolve to anything."
  Nothing enforces it. R1's selector list adds a second thing to keep in sync. A parity test
  is cheap; generating `palette.css` from the JSON is the sturdier answer.

## Open questions

1. **Mix weight.** 12% puts tint-hover at ΔL\* ~10.3–11.6, matching the `--shade-accent`
   baseline it replaces. Reasonable range is 10–14%; worth eyeballing in Storybook before
   the follow-up pins it.
2. **Does the hue stop at the popup?** R3 scopes the vars to the popup. If a coloured `Card`
   should tint any `List` inside it, they belong on `.card` instead — wider blast radius, and
   a separate decision.
3. **Should `--forms-bg-hover` follow?** `.composes-field-surface-color` maps it to
   `--palette-tint-hover`, so it inherits R1 automatically. Almost certainly desirable, but
   it is a behaviour change to every coloured field and deserves an explicit yes.

## Deliverables

| Item                                      | State                                                                                                                       |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Recommendation + token shape (R1–R4)      | This document                                                                                                               |
| `scripts/check-palette-contrast.mjs` (R5) | Landed                                                                                                                      |
| `SPEC.md`                                 | Landed                                                                                                                      |
| Ramp-calibration follow-up (R2)           | [UI-196](https://linear.app/uiid/issue/UI-196/calibrate-the-fill-ramp-steps-for-perceptual-uniformity-across-hues)          |
| Implementation of R1, R3, R4              | [UI-197](https://linear.app/uiid/issue/UI-197/derive-the-tint-hover-token-and-scope-list-theming-to-the-popup), not started |
