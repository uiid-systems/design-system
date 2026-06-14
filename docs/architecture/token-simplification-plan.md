# Token & Theme Simplification — Plan

Status: planned (not started)

This document captures the agreed direction for simplifying the design system's token + theme architecture. It supersedes the runtime-derivation pieces of `token-architecture.md` and `theme-architecture.md` once executed.

## Goal

Make tokens and themes intuitive and easy to understand. Drop OKLCH-based shade derivation in favor of `color-mix()` at the CSS layer. Keep `@uiid/themes` small enough to be consumable from another project. Support SSR (no JS-driven theme math at render time).

## Why this shape

Audit of `packages/*/src/**.module.css` shows:

- Named shade slots dominate: 188 references (`--shade-foreground`, `--shade-accent`, `--shade-muted`, `--shade-surface`, `--shade-background`, `--shade-halftone`).
- The numeric `--shade-1..12` scale is referenced ~6 times total. Dead weight.
- `--color-{red,yellow,...}` primitives used 8 times total. The 1,175-line auto-generated color scale file is almost entirely unused.
- 4 references to `--tone-critical` exist in `forms/radio` and `forms/checkbox` — a removed token system that wasn't cleaned up.
- OKLCH mix-based shade derivation requires per-theme tuning of 12 ratios and is hard to get right perceptually. `color-mix()` with hand-picked percentages on theme-fg+theme-bg gives more predictable results across themes.

## Target shape

A single `:root` block in `@uiid/tokens/globals.css`. No build-time DAG. No JSON token registry at runtime. SSR-trivial.

```css
@layer uiid.tokens {
  :root {
    color-scheme: light dark;

    /* Theme — the 8 user-set tokens. A theme overrides these. */
    --theme-bg:        light-dark(#fefefa, #0d0d0d);
    --theme-fg:        light-dark(#0d0d0d, #fefefa);
    --theme-primary:   #f9262a;
    --theme-secondary: #9036e1;
    --theme-positive:  #00c565;
    --theme-warning:   #e8b700;
    --theme-critical:  #f9262a;
    --theme-info:      #347eff;

    /* Shade — derived neutral slots. Tune percentages once, applies to every theme. */
    --shade-background: var(--theme-bg);
    --shade-surface:    color-mix(in srgb, var(--theme-fg)  5%, var(--theme-bg));
    --shade-accent:     color-mix(in srgb, var(--theme-fg) 12%, var(--theme-bg));
    --shade-halftone:   color-mix(in srgb, var(--theme-fg) 45%, var(--theme-bg));
    --shade-muted:      color-mix(in srgb, var(--theme-fg) 65%, var(--theme-bg));
    --shade-foreground: var(--theme-fg);

    /* Accent tone variants — UNIFORM matrix: 6 accents × 3 variants = 18 tokens.
       Every accent gets surface / border / foreground, even if unreferenced today. */
    --theme-primary-surface:      color-mix(in oklch, var(--theme-primary)   15%, var(--theme-bg));
    --theme-primary-border:       color-mix(in oklch, var(--theme-primary)   30%, var(--theme-bg));
    --theme-primary-foreground:   color-mix(in oklch, var(--theme-primary)   70%, var(--theme-fg));
    --theme-secondary-surface:    color-mix(in oklch, var(--theme-secondary) 15%, var(--theme-bg));
    --theme-secondary-border:     color-mix(in oklch, var(--theme-secondary) 30%, var(--theme-bg));
    --theme-secondary-foreground: color-mix(in oklch, var(--theme-secondary) 70%, var(--theme-fg));
    --theme-positive-surface:     color-mix(in oklch, var(--theme-positive)  15%, var(--theme-bg));
    --theme-positive-border:      color-mix(in oklch, var(--theme-positive)  30%, var(--theme-bg));
    --theme-positive-foreground:  color-mix(in oklch, var(--theme-positive)  70%, var(--theme-fg));
    --theme-warning-surface:      color-mix(in oklch, var(--theme-warning)   15%, var(--theme-bg));
    --theme-warning-border:       color-mix(in oklch, var(--theme-warning)   30%, var(--theme-bg));
    --theme-warning-foreground:   color-mix(in oklch, var(--theme-warning)   70%, var(--theme-fg));
    --theme-critical-surface:     color-mix(in oklch, var(--theme-critical)  15%, var(--theme-bg));
    --theme-critical-border:      color-mix(in oklch, var(--theme-critical)  30%, var(--theme-bg));
    --theme-critical-foreground:  color-mix(in oklch, var(--theme-critical)  70%, var(--theme-fg));
    --theme-info-surface:         color-mix(in oklch, var(--theme-info)      15%, var(--theme-bg));
    --theme-info-border:          color-mix(in oklch, var(--theme-info)      30%, var(--theme-bg));
    --theme-info-foreground:      color-mix(in oklch, var(--theme-info)      70%, var(--theme-fg));

    /* Globals — non-themeable UI primitives. Unchanged from today.
       (Contents of semantic/globals.tokens.json: borders, shadows, transitions,
       padding, transform, disabled, icon, outline, placeholder, header height, z-index.) */
  }
}
```

A theme override becomes 8 lines:

```css
/* Dracula override */
:root {
  --theme-bg:        light-dark(#f8f8f2, #282a36);
  --theme-fg:        light-dark(#282a36, #f8f8f2);
  --theme-primary:   #ff79c6;
  --theme-secondary: #bd93f9;
  --theme-positive:  #50fa7b;
  --theme-warning:   #f1fa8c;
  --theme-critical:  #ff5555;
  --theme-info:      #8be9fd;
}
```

## What disappears

| Currently | After |
| --- | --- |
| `shade.1..12` numeric scale | Gone. Components reference named slots. |
| `colors.generated.tokens.json` (1,175 lines, auto-generated scales) | Deleted. |
| `primitives/colors.tokens.json` (9 base colors w/ OKLCH source) | Deleted. Theme colors live in `theme.tokens.json`. |
| 24 theme-variant derivations computed by `generate-tokens.js` at build time | Browser does it via `color-mix()` in the shipped `:root`. |
| `@uiid/themes` `generator/` (TokenRegistry, `generateTheme`, override propagation through token DAG) | Gone. Replaced with a ~30-line `themeInputToCss(input): string`. |
| OKLCH mix at build time (`packages/tokens/transforms/color-utils.js`) | Only kept if the VSCode converter or schema validation needs it. Otherwise gone. |

## What stays

- `@uiid/themes/schema` — Zod `ThemeInput` (8 hex colors + name).
- `@uiid/themes/vscode` — `convertVscodeTheme(jsonc)` → `ThemeInput`. Pure transform.
- `@uiid/themes/utils` — keep if/only if `themeInputToCss` or the VSCode converter still needs OKLCH math. Otherwise drop.
- `@uiid/themes/presets/*.theme.json` — preset definitions (8 colors each).
- Prebuilt preset CSS files for SSR consumers that don't want to run JS at all.
- `semantic/globals.tokens.json` — borders, shadows, transitions, padding. Unchanged.
- `semantic/forms.tokens.json` — review during migration; may be foldable into globals.
- `primitives/spacing.tokens.json`, `primitives/typography.tokens.json` — unchanged.
- Component-tier tokens (`component/*.tokens.json`) — keep for now, audit per-file during migration.

## Migration order (each step shippable on its own)

1. **Validate visually.** Add the proposed `:root` block as `@layer uiid.tokens.experimental` in one Storybook story. Render button/card/forms side-by-side with current. Tune the 5 shade percentages (5/12/45/65) and the 3 accent percentages (15/30/70) by eye until they feel right across light + dark + a couple of preset themes. Goal: confidence in the values before any larger refactor.

2. **Fix broken `--tone-critical` references.** Replace 4 instances in `packages/forms/src/radio/radio.module.css` and `packages/forms/src/checkbox/checkbox.module.css` with `--theme-critical`. Independent of the migration; fixes a real bug.

3. **Swap component CSS for the 6 numeric shade refs.** `--shade-9 → --shade-muted`, `--shade-7 → --shade-halftone`, `--shade-3 → --shade-accent`, `--shade-2 → --shade-surface`. Small mechanical change. After this, no component references the numeric scale.

4. **Make `:root` the new shape.** Update `packages/tokens/src/globals.css` (or whatever the entry CSS is) to emit the new `:root` block. Numeric shade scale and unused theme variants disappear from output. Build pipeline for shades disappears at the same time.

5. **Trim source JSON.** `shade.tokens.json` keeps 6 slots (no numeric scale). `theme.tokens.json` keeps 8 brand colors (no surface/border/fg variants — those are derived in CSS now). Delete `colors.generated.tokens.json`. Probably delete `primitives/colors.tokens.json`. Update `scripts/generate-tokens.js` accordingly (or replace with something much smaller).

6. **Rewrite `@uiid/themes`.** Drop `generator/`, `utils/` (unless something needs it), and the `TokenRegistry` abstraction. New public surface:
   - `@uiid/themes/schema` — Zod schema (unchanged)
   - `@uiid/themes/vscode` — converter (unchanged)
   - `@uiid/themes/css` — exports `themeInputToCss(input: ThemeInput): string` producing an 8-line `:root` override
   - `@uiid/themes/presets/*` — JSON theme files + their generated CSS overrides
   
   Move `zod` from `devDependencies` to `dependencies`. Add a `.` export. Total package size should be < 100 LOC.

7. **Wire docs app to the new themes package.** Preset selector now just swaps 8 variables. SSR identical to today (Server Component injects `<style>` from cookie-selected preset). Drop the dead `@uiid/themes` dep in `apps/docs/package.json` if it's not actually used after this; otherwise wire it up.

## Open questions to settle during execution

- Final percentages for shade slots (5/12/45/65) and accent tone variants (15/30/70). Likely tuned during step 1.
- Should `surface` get a sibling `surface-hover`/`surface-active` for interactive states? Not in current token system; not in scope here. Note if needed.
- `globals.tokens.json` is keeping `border.color: var(--shade-accent)` etc. as derived globals. Should those move into the `:root` block too, or stay as JSON-source-of-truth that generates the CSS? (Probably the former — fewer indirection layers.)
- Component-tier tokens audit: are they actually used by their components, or do components reference `--theme-*` / `--shade-*` / `--globals.*` directly? Drop the unused ones.

## SSR notes

- `color-mix()` is browser-evaluated at paint time. No SSR resolution needed. HTML + CSS go over the wire; browser computes the color when painting. This is identical to how `var()`, `calc()`, and `light-dark()` work.
- `light-dark()` works correctly when `color-scheme: light dark` is set on `:root`. That's already done in the proposed `:root` block.
- No JS theme math at render time. Themes are static CSS overrides. The docs app's "swap preset by cookie" pattern works unchanged.
- If anything (browser chrome `<meta name="theme-color">`, screenshot rendering) needs the *resolved* hex of a derived shade server-side, do that math in JS at request time — but that's an edge case to handle when it comes up, not a foundational concern.

## Reference: usage data driving this

Counted in `packages/*/src/**.module.css`:

```
--shade-foreground       65 references
--shade-accent           36
--shade-muted            27
--shade-surface          26
--shade-background       24
--shade-halftone         10
                       ----
                        188 named-slot total

--shade-{9,7,3,2}         6 numeric-scale total

--theme-primary           4
--theme-{white,black}     2 each
--theme-{warning,positive,critical,info} and -surface/-foreground variants  ~10 total

--color-{red,yellow,...}  8 total

--tone-critical           4 (broken — fix in step 2)
```
