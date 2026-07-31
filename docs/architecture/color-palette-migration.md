# Color palette migration

Status as of the branch `tokens/static-rebuild` (PR #280).

This is a two-part migration. **Part 1 (the token layer) is done and in review.**
**Part 2 (the component conversion) has not been started.** This document is the
handoff for part 2 — it should be enough to start from without re-deriving anything.

The work was ported in reverse from balance's `UI-364`
(`Tabs-Platform/tabs-backend#19166`), which did the same migration first. That PR
is a useful reference, but UIID diverges in several places noted below.

---

## Part 1 — the token layer (done, PR #280)

**79 files, +943 / −4,297.**

- **Ramps are hand-authored.** `packages/tokens/src/json/primitives/colors.tokens.json`
  now holds 8 ramps (`red`, `orange`, `yellow`, `green`, `blue`, `indigo`,
  `purple`, `neutral`) as plain hex, 50–950. Each hue's `500` **is** its authored
  anchor, so a ramp contains the colour it is named after by construction.
  - The old generator was discarding the authored lightness: `generateColorScale`
    accepted `baseL` and never used it, pinning every `500` to `L=0.58`. All 7
    hues failed to contain their own anchor (`yellow #e8b700` generated as
    `#a17200`). This is why generation was abandoned rather than fixed.
  - Ramps were generated once, offline, with **gamut mapping** — chroma reduced
    until the colour fits sRGB, holding L and H. The old converter clipped each
    channel independently, which shifts hue (`purple-50` read pink).
- **Semantic palette** in `packages/tokens/src/palette.css` — 8 hues × 8
  treatments, as **global** classes (`.palette-red` …). Not CSS Modules: modules
  hash per build and would be unreachable from `globals.css`, so the hues would
  resolve to nothing in the bundle.
- **`packages/tokens/src/palette.ts`** exports `PaletteColor`, `PALETTE_HUES`,
  `paletteAnchor`, `paletteColorStyles`, derived from the token JSON (an entry is
  a hue if it has a `500` step — this is what keeps `white`/`black` and DTCG `$`
  metadata out of the union).
- **No colour maths in the token layer.** `generate-scales.js`,
  `transforms/color-utils.js`, `style-dictionary.config.js` and the orphaned
  `tone.tokens.css` are gone. `light-dark` is the only remaining derive method.
- **`--shade-1..12` collapsed to 6 aliases**, pinned to the values the ramp baked
  out, so nothing re-renders. `@uiid/themes` was deleted entirely — see
  `theme-architecture.md`, which this supersedes.

### The palette contract

```
--palette-fill          filled surface (solid Button, Badge)
--palette-on-fill       text/icon on --palette-fill
--palette-fill-hover    --palette-fill on hover/press

--palette-tint          tinted surface (coloured Card, subtle Button, Badge)
--palette-on-tint       text/icon on --palette-tint
--palette-tint-hover    --palette-tint on hover/press
--palette-tint-border   border around a --palette-tint surface

--palette-text          the hue as text on the page background
```

Every pairing clears WCAG AA measured from the authored hex; the tightest is
**5.10:1**. Unlike balance, no hue needed an exception block (balance had to
special-case `cyan`).

---

## Part 2 — the component conversion (NOT started)

Components still derive colour at render time from `--palette-hue` /
`--palette-chroma`, published by CSS-Module classes in **`@uiid/typography`**
(`packages/typography/src/text/text.variants.ts`). Nothing is half-converted:
part 1 left that mechanism untouched, so everything renders as it did before.

### 1. Replace the render-time oklch

**29 `oklch()` expressions across 5 files** collapse onto the 8 names above:

| file | count |
| --- | --- |
| `packages/buttons/src/button/button.module.css` | 13 |
| `packages/cards/src/card/card.module.css` | 7 |
| `packages/indicators/src/badge/badge.module.css` | 4 |
| `packages/indicators/src/status/status.module.css` | 2 |
| `packages/typography/src/text/text.module.css` | 2 |

The mapping is direct — every current derivation is already one of the eight
treatments. Badge's `bg`/`fg`/`border` are exactly `tint`/`on-tint`/`tint-border`;
Button's `.color` is `fill`/`on-fill`/`fill-hover` and `.color.variant-subtle` is
the tint set; Card's `.color-surface` is the tint set. Balance's versions of
`button.module.css`, `card.module.css` and `text.module.css` are worth reading as
a reference for the exact shape.

Note Card's `.color-surface` and Button's `.color.variant-subtle` were
byte-identical derivations — after conversion they share one `--palette-tint`
contract and can no longer drift apart.

### 2. Move the palette type out of typography

`paletteColorStyles` / `PaletteColor` currently live in `@uiid/typography`, which
means `@uiid/buttons` depends on `@uiid/typography` purely for palette work.
Replace with the already-published `@uiid/tokens/palette`. Balance made exactly
this move and dropped the dependency.

Consumers to update:

- `packages/buttons/src/button/{button.tsx,button.types.ts}`
- `packages/cards/src/card/{card.tsx,card.types.ts}`
- `packages/indicators/src/{badge/badge.variants.ts,status/status.variants.ts}`
- `packages/typography/src/{index.ts,text/text.variants.ts}`
- `packages/registry/src/shared.ts` plus the `card`, `status`, `avatar`, `text`,
  `timeline`, `badge` entries under `packages/registry/src/components/`

The registry coupling is **UIID-only** — balance had no registry, so its PR is no
guide here.

Text's per-hue classes collapse to one rule once the hue travels on the tokens
class (balance went from 66 lines to 11).

### 3. Consumer sweep — which components should take a hue?

Requested explicitly: **Avatar** is a candidate. Also worth assessing Timeline,
Progress, and Separator. The question to answer per component is whether it wants
the `fill` set, the `tint` set, or just `--palette-text`.

### 4. Known follow-ups

- **`packages/forms/src/field/field.module.css`** uses `var(--color-red-500)` for
  error text — ~3.4:1, an AA failure. It was left render-neutral in part 1 on
  purpose. It should become `.palette-red` + `--palette-text` (clears AA).
- **`packages/interactive/src/rich-text-editor/styles/index.css`** still contains
  `oklch()` and was outside part 1's scope.
- `dtcg.schema.json` and the `lint:tokens` script are still present but were never
  wired into the `lint` task. Balance deleted both. Removing them means stripping
  `$schema` from ~23 token files, so it was deferred.

---

## Sidequest — the Storybook Vercel build (separate, unfinished)

Hit while part 1 was in review; **not part of PR #280**. Committed but
**unpushed** on `ci/fix-storybook-build` (`8e818f3b`). Three independent causes:

1. **Vercel never ran the storybook build.** It runs the root `build` task, which
   builds the 18 packages that have a `build` script. `apps/storybook` only has
   `build-storybook`, so no `storybook-static` was produced — hence
   *"No Output Directory named storybook-static"*. Fixed by adding
   `apps/storybook/vercel.json` with an explicit `buildCommand`/`outputDirectory`.
2. **Two undeclared imports.** Stories import `date-fns` and `@tiptap/react`,
   which are declared in `packages/calendars` and `packages/interactive` but not
   in `apps/storybook`; pnpm's strict isolation makes them unresolvable. Fixed by
   declaring both.
3. **`RichTextEditor` is not exported** from the `@uiid/interactive` barrel, so
   `@uiid/design-system` does not re-export it and its story cannot import it.

**Point 3 is unresolved and needs a decision.** Adding it to the barrel makes the
build pass but drags tiptap in and **fails `pnpm size`** (which the `pre-push`
hook runs):

- `@uiid/interactive` — 120 kB limit, 286 kB actual
- `@uiid/design-system` — 500 kB limit, 629 kB actual

That strongly suggests the omission was deliberate, and the *story* importing from
`@uiid/design-system` is the actual bug. Options, best first:

1. Give it a `./rich-text-editor` subpath export in `@uiid/interactive` (needs a
   second vite build entry) and import the story from there. Keeps the barrel lean.
2. Raise the size limits — taxes every consumer with ~166 kB of tiptap.
3. Drop the story — hides the problem.

Also found while fixing: `RichTextEditorProps` was declared **twice**, identically,
in both `rich-text-editor.tsx` and `rich-text-editor.types.ts`, which collide under
`export *`. The branch dedupes toward `.types.ts` and repoints
`rich-text-editor.utils.ts` at it. That part is worth keeping regardless.
