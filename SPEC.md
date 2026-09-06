# Spec: UI-194 — Theming lists and option surfaces on palette tokens

**Type:** Spike (recommendation + token/composition shape — _not_ an implementation)
**Ticket:** [UI-194](https://linear.app/uiid/issue/UI-194/spike-theming-lists-and-option-surfaces-on-palette-tokens)
**Follows:** UI-184, which brought the palette `color` prop to the dropdown popup of select/combobox/autocomplete
**Branch:** `ui-194`

---

## Objective

UI-184 tinted the dropdown _popup_ cheaply — it renders a `Card`, `Card` takes `color`, so the surface was a
prop pass-through. It also pointed `.composes-option`'s highlight at `--palette-tint-hover`. What it skipped was
the contrast budget for that shortcut, and everything else inside the popup: the selected-item indicator, the
group labels, and `@uiid/lists`, which has no palette treatment at all.

This spike answers four questions with measurements rather than judgement, and lands a recommendation plus a
concrete token shape. **No component CSS changes ship from this ticket.**

1. Does the highlight still read as a highlight on a tinted popup, at every hue, in both schemes?
2. Does the hue-blind chrome beside it (indicator, group labels, descriptions) actually fail anything?
3. Does list theming belong to `@uiid/lists`, or does the popup scope it via vars?
4. Whatever is chosen must clear AA against the _tinted popup surface_, not `--shade-background` — the existing
   pairings in `palette.css` are measured against the page.

**Success looks like:** a reviewer can read the recommendation, see the numbers behind it, and open the
follow-up implementation ticket without re-deriving anything.

### Scope expansion (approved)

While specifying, the question was raised: if the option highlight is going to be derived rather than
hand-authored, shouldn't _every_ hover value in the palette be? It was measured. The answer is **partly**, and
the boundary is load-bearing — see [Finding 4](#finding-4--the-unification-carries-for-tint-and-stops-at-fill).
Scope grows to cover `--palette-tint-hover` across all eight hues; `--palette-fill-hover` is explicitly
excluded, with evidence.

---

## Findings

All numbers below were computed from the authored hex in `packages/tokens/src/json/primitives/colors.tokens.json`.
Two instruments are used, deliberately:

- **WCAG contrast ratio** for text-on-surface pairings, where AA (4.5:1) is the bar.
- **ΔL\*** (CIE lightness delta) for surface-on-surface pairings. WCAG ratio is the wrong instrument for "is
  this band visible" — at these levels it compresses everything into 1.0–1.5 and distinguishes nothing. The
  system's own calibration point is **ΔL\* ≈ 10.5–11.5**: the `--shade-accent`-on-page treatment that
  `.composes-option` replaced.

### Finding 1 — the contrast budget is fine, and that reframes the ticket

Every text pairing already clears AA on a tinted popup, at every hue, in both schemes:

| Pairing                                                          | Light       | Dark        |
| ---------------------------------------------------------------- | ----------- | ----------- |
| `--palette-on-tint` on the highlighted row                       | 8.33–10.59  | 7.68–8.22   |
| `--shade-muted` on `--palette-tint` (group labels, descriptions) | 7.84–9.45   | 7.49–8.47   |
| `--shade-muted` on the highlighted row                           | 6.41–7.39   | 4.97–7.21   |
| `--shade-foreground` on `--palette-tint` (item icon)             | 16.13–19.44 | 15.86–17.96 |

The tightest pairing in the whole matrix is 4.97:1 (dark yellow). **Nothing fails AA.** The ticket's worry that
chrome "has to clear AA against the tinted popup surface" is already satisfied — because `--shade-muted` and
`--shade-foreground` are near the extremes of the lightness axis and the tints are near the other, the tinting
never squeezes them.

So hue-blind chrome is a **consistency** defect, not an accessibility one. That lowers its urgency and changes
what a fix must prove: it must not regress the uncoloured case, and it does not need to hit a contrast target
it is already clearing.

### Finding 2 — the highlight is the real defect

Measured as ΔL\* between the highlighted row and the popup surface it sits on:

| Scheme | Current range    | Weakest hue   | System baseline |
| ------ | ---------------- | ------------- | --------------- |
| Light  | **2.77 – 13.64** | yellow (2.77) | ~11.5           |
| Dark   | 7.32 – 13.41     | indigo (7.32) | ~10.5           |

Six of eight hues in light mode fall below the baseline. Yellow at 2.77 is effectively invisible — the
highlighted option does not read as highlighted. The cause is structural: **the colour ramps are not
perceptually uniform**, so "one step up" means something different at every hue.

Stepping harder does not rescue it. Moving dark mode to the `700` step lifts ΔL\* to 16–29, but drives the
highlighted row's own label to **4.37:1 at yellow — below AA**, with orange (4.70) and green (4.74) grazing it.
There is no single ramp step that is both visible and safe.

### Finding 3 — two of the ticket's assumptions are wrong

- **`.select-item-indicator` is already hue-aware.** `packages/forms/src/select/select.module.css:55` sets only
  `flex-shrink`/`height`/`width`. The `CheckIcon` inherits `currentColor`, which `Card` sets to
  `--palette-on-tint`. It tracks the hue today, by inheritance. No work needed.
- **The group label and item icon are pinned, not merely un-themed.** `PopupLayerGroupLabel` hard-codes
  `shade="muted"`; `packages/lists/src/list/subcomponents/list-item.tsx:38` pins the icon with
  `style={{ color: "var(--shade-foreground)" }}`. That inline style is also a direct violation of the
  inline-style ban in `.agents/styling.md`, and there is a second one (`style={{ listStyleType: "none" }}`) on
  the wrapping `Group` at line 30.

### Finding 4 — the unification carries for tint, and stops at fill

The scope question, measured. Current hand-authored hover steps, as ΔL\*:

| Family                | Light spread           | Dark spread           |
| --------------------- | ---------------------- | --------------------- |
| `tint` → `tint-hover` | 2.77–13.64 (**10.86**) | 7.32–13.41 (**6.09**) |
| `fill` → `fill-hover` | 8.76–15.42 (**6.66**)  | 3.61–10.69 (**7.08**) |

None are uniform — the instinct behind the scope expansion is correct. But a single derivation only fixes one
of them. Deriving hover as `color-mix(in oklab, var(--shade-foreground) N%, <surface>)`:

|            | tint-hover @ 12%              | fill-hover @ 26%             |
| ---------- | ----------------------------- | ---------------------------- |
| Light ΔL\* | 10.71–11.53 (spread **0.82**) | 5.26–10.15 (spread **4.90**) |
| Dark ΔL\*  | 10.29–11.63 (spread **1.34**) | 4.97–11.92 (spread **6.95**) |
| Worst AA   | 6.71                          | 7.42                         |

**Tint converges; fill does not.** The reason is in the ramps, not the method: the tint anchors (`50` in light,
`900` in dark) are lightness-matched across hues, so a fixed proportional mix moves them all equally. The fill
anchors are not — `yellow-700` (#7a5f00) and `purple-700` (#56008f) differ substantially in lightness, so the
same mix produces different ΔL\*. **Derivation cannot fix an uncalibrated base.**

A chroma-preserving alternative — `oklch(from <surface> calc(l + S) c h)` — was also measured. It gives the
tightest tint uniformity of anything tested (spread **0.06** in light), but pushes **seven of eight hues outside
the sRGB gamut** for fill, leaving the result to per-engine gamut mapping. Rejected on that basis.

---

## Recommendation

### R1 — Derive `--palette-tint-hover`; fix the option highlight for free

Replace eight hand-authored `--palette-tint-hover` declarations with one derivation:

```css
/* palette.css — one rule, alongside the per-hue blocks.
   Hover is a step toward the scheme's foreground: black in light, white in dark,
   so a single expression covers both without a light-dark() pair per hue. */
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

Why this shape:

- **`.composes-option` needs no change at all.** It already reads `--palette-tint-hover`. Fixing the token fixes
  the highlight — the UI-194 defect closes as a side effect of the consistency work, with no special case.
- **Established idiom.** `packages/tables/src/table/table.module.css:77` already derives Table's row hover as
  `color-mix(in oklab, var(--shade-foreground) 4%, transparent)`. This is the same rule at a different weight.
- **The `light-dark()` nesting is already proven.** `--shade-foreground` _is_ a `light-dark()` (emitted by
  `build-tokens.js:99`), and Table mixes it in shipped CSS today.
- **The selector list is required, not stylistic.** Custom properties substitute at the element that _declares_
  them, so hoisting this to `:root` would resolve `var(--palette-tint)` where it is undefined and yield the
  guaranteed-invalid value. It must sit on the palette classes.

The alternative direction — mixing toward `--palette-on-tint` rather than `--shade-foreground` — preserves
chroma slightly better and also converges (light spread 1.71, dark 0.71; worst AA 7.22). It is a legitimate
second choice. `--shade-foreground` is recommended because it matches the Table precedent and makes hover _one_
rule across the system rather than one rule for palette and another for neutral surfaces.

### R2 — Leave `--palette-fill-hover` hand-authored, and file the real cause

Do not derive it. Per Finding 4, derivation leaves a spread of 4.90/6.95 — no better than the 6.66/7.08 it
would replace, while trading eight explicit values for an expression that only _looks_ principled.

The genuine defect is that the `700`/`400` ramp steps are not lightness-calibrated across hues (dark yellow's
fill hover is ΔL\* 3.61 — as near-invisible as the tint case). That is a ramp-calibration ticket with blast
radius across every filled Button and Badge, and it should be filed separately with these measurements
attached — filed as [UI-196](https://linear.app/uiid/issue/UI-196/calibrate-the-fill-ramp-steps-for-perceptual-uniformity-across-hues). **Do not fold it into UI-194.**

### R3 — The popup scopes list theming; `@uiid/lists` stays neutral

Follow the pattern `.composes-control-fill-color` already establishes in `compositions.css` — deliberately
generic names, read with a shade fallback, so an uncoloured consumer resolves exactly as it does today:

```css
/* @uiid/lists reads generic names it does not own, each with the shade
   fallback it uses now. Nothing about the palette enters the package. */
.list-text-description {
  color: var(--list-description-color, var(--shade-muted));
}
.list-item svg {
  color: var(--list-icon-color, var(--shade-foreground));
}
```

```css
/* The popup publishes them for its subtree. The hue stops at the popup
   boundary; a List rendered anywhere else is untouched. */
.popup-layer-popup,
.select-popup {
  --list-description-color: var(--palette-on-tint);
  --list-icon-color: var(--palette-on-tint);
}
```

Rationale: `@uiid/lists` is a structural package, and a `List` is not inherently a themed surface. Giving it a
`color` prop would couple it to the palette for the sake of one consumer that already owns a themed boundary.
Scoping keeps the dependency pointing the right way and gives a zero-diff uncoloured path by construction.

The group label is the same problem in TSX rather than CSS: `PopupLayerGroupLabel` passes `shade="muted"`,
which pins it. It should drop the prop and take its colour from the scoped var like everything else.

### R4 — Fix the inline styles in `list-item.tsx`

Both `style={{}}` usages (lines 30 and 38) violate `.agents/styling.md` outright, and the one on line 38 is
precisely what makes the icon un-themeable. Moving the colour into `list.module.css` is a prerequisite for R3,
not a separate cleanup.

### R5 — Commit the measurement script

There is no contrast tooling in the repo; every number in this document came from a throwaway script. Land it
as `scripts/check-palette-contrast.mjs` so "clears AA against the surface it is named for" — a claim
`palette.css:20-23` makes in prose — becomes checkable rather than re-derived by hand at each retune.

---

## Tech Stack

No new dependencies. The recommendation uses only what already ships:

- **CSS `color-mix(in oklab, …)`** — already used in `tables`, `buttons`, `indicators`, `navigation`
- **CSS `light-dark()`** — emitted by `build-tokens.js` for every derived token
- **CSS custom properties + `@layer`** — the existing `uiid.tokens` / `uiid.compositions` / `uiid.states` order
- Node ≥ 18 for the measurement script (no dependencies; hex maths only)

---

## Commands

```bash
pnpm install                                # Install dependencies
pnpm run build --filter=@uiid/tokens        # Rebuild token CSS (src/css/** is generated, not committed)
pnpm run build                              # Build all packages
pnpm test:run                               # Run all tests
pnpm test:run packages/tokens               # Run one package's tests
pnpm run storybook                          # Verify hues visually, both schemes
pnpm run lint                               # oxlint, from the repo root
pnpm run format:check                       # oxfmt, from the repo root
node scripts/check-palette-contrast.mjs     # (R5) Measure every palette pairing
```

Note: `packages/tokens/src/css/**` is build output from `build-tokens.js`, not source. Token changes require a
`@uiid/tokens` build before they appear anywhere.

---

## Project Structure

Files this spike reads, and where its output lands:

```
docs/architecture/
  ui-194-list-and-option-theming.md   → THE DELIVERABLE: recommendation + measurements
SPEC.md                               → this file

scripts/
  check-palette-contrast.mjs          → (R5) repeatable contrast + ΔL* check

packages/tokens/src/
  palette.css                         → (R1) the 8 hue blocks; hover derivation lands here
  compositions.css                    → .composes-option (L322) — reads the token, needs no change
  palette.ts                          → PALETTE_HUES, paletteColorStyles — hue list, derived from JSON
  json/primitives/colors.tokens.json  → authored hex; the source for every number above

packages/forms/src/
  shared/popup-layer/                 → (R3) combobox + autocomplete popup tree
  select/select.module.css            → (R3) .select-popup, .select-item-indicator
  select/subcomponents/select-item.tsx

packages/lists/src/list/
  list.module.css                     → (R3) .list-text-description, .list-item svg
  subcomponents/list-item.tsx         → (R4) two inline styles to remove
```

---

## Code Style

Token and composition rules carry a comment explaining _why_, not what — matching the density already in
`compositions.css` and `palette.css`. A rule whose ordering or fallback is load-bearing says so, because the
next person will otherwise move it:

```css
/**
 * Hover is derived, not authored: one step toward the scheme's foreground.
 * `--shade-foreground` is black in light and white in dark, so a single
 * expression covers both and the eight hand-picked ramp steps this replaces
 * stop drifting apart — those measured ΔL* 2.77 at yellow and 13.64 at
 * neutral for what is nominally the same step.
 *
 * The selector list is load-bearing. Custom properties substitute at the
 * element that declares them, so hoisting this to `:root` would resolve
 * `var(--palette-tint)` where it is undefined and land on the
 * guaranteed-invalid value.
 */
.palette-red, .palette-orange, /* … */ {
  --palette-tint-hover: color-mix(
    in oklab,
    var(--shade-foreground) 12%,
    var(--palette-tint)
  );
}
```

Conventions that apply:

- **No `style={{}}`** for layout, spacing, sizing, or text (`.agents/styling.md`). This is what R4 fixes.
- **Token JSON holds primitives only** — a literal or a plain `{ref}`. Never `calc()` or `color-mix()` in a
  `$value`; arithmetic belongs in the CSS module. The R1 derivation is therefore CSS, not JSON.
- **Components never name a hue or a step** — they apply `.palette-<hue>` and read `--palette-*`.
- **Generic var + shade fallback** for anything crossing a package boundary (R3), so the uncoloured path is
  unchanged by construction.
- Prefer `Stack`/`Group`/`Box` and `Text` over raw flex/grid and raw text elements.

---

## Testing Strategy

**Vitest**, configured at the repo root; test files sit beside components as `{component}.test.tsx`.

| Level                | What it covers                                                                                   | Where                                   |
| -------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------- |
| Contrast script (R5) | Every palette pairing vs. the surface it is named for; ΔL\* for surface-on-surface               | `scripts/check-palette-contrast.mjs`    |
| Unit                 | Every hue in `PALETTE_HUES` has a matching block in `palette.css` and declares the derived hover | `packages/tokens/src/palette.test.ts`   |
| Unit                 | `ListItem` renders no inline `style` attribute (regression guard for R4)                         | `packages/lists/src/list/list.test.tsx` |
| Unit                 | An uncoloured `List` computes the same colours as before R3                                      | `packages/lists/src/list/list.test.tsx` |
| Visual               | Every hue's popup + highlight, both schemes                                                      | `apps/storybook/stories/`               |

The parity test closes a gap `palette.ts` already documents in prose: a hue added to the token JSON appears in
`PALETTE_HUES` automatically but "needs a matching block in `palette.css` to resolve to anything." Today nothing
catches that.

Two caveats that shape what is worth asserting:

- **jsdom does not compute `color-mix()`.** Tests can assert the declaration is present and that class/var
  wiring is correct; they cannot assert a resolved colour. The numeric guarantees belong to the script, which
  works on authored hex.
- Tests and Storybook alias `@uiid/*` to source; only `apps/docs` consumes built `dist`. A dist-only failure is
  invisible to both.

---

## Boundaries

**Always**

- Measure before recommending — every colour claim cites a computed number, not an impression.
- Keep the uncoloured path byte-identical: any new var is read with the shade fallback it uses today.
- State which instrument a number came from (WCAG ratio vs. ΔL\*) and why that one.
- Run `pnpm run lint` and `pnpm run format:check` from the repo root, never per package.
- Rebuild `@uiid/tokens` after touching token JSON or `palette.css`.
- Verify a component's API in `.types.ts` / `.variants.ts` before using it.

**Ask first**

- Any change to `--palette-fill-hover` or the ramp steps themselves (blast radius: every Button and Badge).
- Adding a public prop to `@uiid/lists` — R3 deliberately avoids this.
- Widening `.composes-option`, which is shared by select, combobox, and autocomplete at once.
- Changing `@layer` order in `globals.css` — `compositions.css:9-14` records what that last broke.
- Adding any dependency, including a colour library for the R5 script.

**Never**

- Ship implementation from this ticket. The deliverable is a recommendation; the code lands in the follow-up.
- Put `calc()`, `color-mix()`, or any expression in a token `$value`.
- Add `style={{}}` for layout, spacing, sizing, or text.
- Reintroduce a hand-maintained parallel schema of component metadata.
- Add `Co-Authored-By` trailers or any AI attribution to commits, PRs, comments, or docs.
- Edit `packages/tokens/src/css/**` — it is generated by `build-tokens.js`.

---

## Success Criteria

The spike is done when all of the following are true:

1. `docs/architecture/ui-194-list-and-option-theming.md` exists and states a single recommendation per open
   question in the ticket, each backed by a measured number.
2. The highlight question is answered quantitatively: current ΔL\* per hue per scheme, the proposed
   derivation's ΔL\* per hue per scheme, and the AA figure for the highlighted row's label under both.
3. The doc records that **no text pairing currently fails AA on a tinted popup** (Finding 1), so the follow-up
   is not scoped as an accessibility fix.
4. The ownership question is answered with a concrete token shape — the exact var names, their fallbacks, and
   which file declares versus consumes each.
5. The fill-hover exclusion is justified with numbers, and a separate ramp-calibration ticket is filed
   referencing them.
6. `scripts/check-palette-contrast.mjs` runs clean on `main` and reproduces every number in the doc.
7. The two `select-item-indicator` / group-label corrections from Finding 3 are recorded on the ticket, so the
   follow-up does not implement work that is already done.
8. `pnpm run lint`, `pnpm run format:check`, and `pnpm test:run` all pass.

**Explicitly out of scope:** changing `.composes-option`, `palette.css`, `list.module.css`, or `list-item.tsx`.

---

## Open Questions

1. **Mix weight.** 12% puts tint-hover at ΔL\* ~10.3–11.6, matching the `--shade-accent` baseline it replaced.
   Reasonable range is 10–14%. Worth eyeballing in Storybook before the follow-up pins it.
2. **Mix target — `--shade-foreground` or `--palette-on-tint`?** Both converge. `--shade-foreground` matches the
   Table precedent and unifies hover system-wide; `--palette-on-tint` desaturates less. Recommending the
   former; the latter is a defensible call if chroma retention at hover matters more than one shared rule.
3. **Does the hue stop at the popup?** R3 scopes the vars to `.popup-layer-popup` / `.select-popup`. If a
   coloured `Card` should tint any `List` inside it, the vars belong on `.card` instead — a wider blast radius
   and a separate decision.
4. **Should `--forms-bg-hover` follow?** `.composes-field-surface-color` maps it to `--palette-tint-hover`, so
   it inherits R1 automatically. That is almost certainly desirable — a coloured input's hover gets the same
   uniformity — but it is a behaviour change to every coloured field and deserves an explicit yes.
5. **Selector-list maintenance.** R1's rule must list all eight hues. The parity test covers drift, but if hues
   are expected to be added often, generating `palette.css` from the token JSON is the sturdier answer and a
   larger change.
