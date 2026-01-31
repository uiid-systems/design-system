# Tokens Color System: Concerns, Improvements, Next Steps

## What's Working Well

The `globals.css` shade system using `color-mix(in oklab, ...)` with percentage variables to derive `--shade-muted`, `--shade-halftone`, `--shade-accent`, and `--shade-surface` from just two base colors (foreground/background) is the right idea. Every gray tone adapts automatically when themes switch. The cascade layer organization is also solid.

---

## Concerns

### 1. The hardcoded hex palette is dead weight for grays

`colors.tokens.json` has 11 neutral hex values (`#f9fafb` through `#030712`) that are essentially Tailwind's gray scale copy-pasted. The actual theme system doesn't use them — components consume `--shade-surface`, `--shade-accent`, `--shade-muted`, and `--shade-halftone`, which are dynamically mixed. The neutral palette sits there unused or redundant. If grays are generated dynamically (which they are), the static neutral scale is just noise.

### 2. Only four gray stops isn't enough

Current stops: `surface` (~98% bg), `accent` (~92% bg), `halftone` (50/50), `muted` (~35% bg). That's a coarse ramp. Real UIs need more granularity — subtle hover states, disabled backgrounds, secondary borders, input fills, divider lines. Components have to choose between four stops or fall back to raw `color-mix()` calls inline, which defeats the point of tokens.

### 3. Dark mode percentages feel hand-tuned and fragile

The light/dark percentage pairs (e.g., `surface: 98%/80%`, `accent: 92%/73%`) are magic numbers. They produce visually okay results, but there's no systematic relationship between them. Adding a new shade stop means manually picking both a light and dark percentage and eyeballing the contrast. This doesn't scale.

### 4. Tones are undercooked

`tones` just aliases a single `500` value per semantic color. No light/dark variants, no accessible foreground pairing, no surface tints. A `critical` tone needs at least a background, foreground, and border variant to be useful in real components (alerts, badges, form errors).

### 5. Figma interop will be painful

Figma Variables don't support `color-mix()` or CSS functions. This requires either: (a) a build step that resolves the mixed values to static hex for Figma export, or (b) a different strategy where the JSON source defines concrete values per theme and CSS uses references. The dynamic CSS approach and Figma's static variable model are currently at odds.

### 6. `light-dark()` is unused

CSS now has `light-dark()` which would collapse the three rule blocks (`:root`, `@media prefers-color-scheme`, `[data-theme]`) into single declarations. It respects `color-scheme` automatically.

---

## Recommendations

### Generate a full shade ramp from the two base colors

Instead of 4 stops, define a systematic scale (e.g., 8-12 stops) using `color-mix()` with evenly spaced percentages:

```css
--shade-1: color-mix(in oklch, var(--shade-foreground), var(--shade-background) 95%);
--shade-2: color-mix(in oklch, var(--shade-foreground), var(--shade-background) 88%);
--shade-3: color-mix(in oklch, var(--shade-foreground), var(--shade-background) 80%);
/* ... through ... */
--shade-12: color-mix(in oklch, var(--shade-foreground), var(--shade-background) 5%);
```

Then alias semantic names to these stops: `--shade-surface: var(--shade-1)`, `--shade-accent: var(--shade-2)`, etc. This gives both a numeric scale for flexibility and semantic names for intent.

**Key change: use `oklch` instead of `oklab`.** OKLCH gives perceptually uniform lightness steps (the L channel is linear), meaning the ramp will look evenly spaced to the human eye. It also allows introducing subtle chroma or hue shifts into grays later (warm grays, cool grays) by adjusting the C and H channels.

### Eliminate separate light/dark percentage variables

With a well-designed ramp, different percentages per theme aren't needed. The ramp is defined relative to `--shade-foreground` and `--shade-background`, which already flip between themes. If shade-1 is "95% background, 5% foreground," it automatically produces a near-white in light mode and a near-black in dark mode. The relative mixing handles it.

If some stops need tuning per theme, that's a sign the mixing percentages aren't evenly distributed. Fix the scale, don't add per-theme overrides.

### Adopt `light-dark()` for any values that genuinely differ between themes

For the few things that *do* need different values per theme (like base `--shade-background` and `--shade-foreground`), use:

```css
:root {
  color-scheme: light dark;
  --shade-background: light-dark(white, black);
  --shade-foreground: light-dark(black, white);
}
```

This eliminates the `@media` block and the `[data-theme]` selectors for those values. Still support `data-theme` by setting `color-scheme: light` or `color-scheme: dark` on the root when the attribute is present.

### Build semantic tone palettes from the color primitives using relative color syntax

Instead of `tones.critical = red.500`, generate a full semantic set:

```css
--tone-critical: oklch(from var(--colors-red-500) l c h);
--tone-critical-surface: oklch(from var(--colors-red-500) 0.95 0.03 h);
--tone-critical-muted: oklch(from var(--colors-red-500) 0.45 c h);
--tone-critical-border: oklch(from var(--colors-red-500) 0.75 0.08 h);
```

Relative color syntax (`oklch(from ...)`) lets you derive tints/shades/muted variants from a single base hue. This keeps the JSON source lean (one base per tone) while producing a usable palette.

### Decide on the Figma strategy now

Two real options:

- **Option A**: Keep dynamic CSS as source of truth, add a build step that evaluates `color-mix()`/`oklch()` into resolved hex values and exports those to a Figma-compatible format (JSON or Figma Variables API). The token pipeline already has a generate step — extend it.
- **Option B**: Define the full resolved palette in JSON (one set per theme), generate CSS that references them. More verbose but Figma gets native values directly.

Option A is more maintainable long-term since CSS stays dynamic. Would need a Node script that resolves colors using something like `culori` or the CSS color spec algorithms.

### Consider dropping or significantly reducing `colors.tokens.json`

If components truly only use the shade system and semantic tones, the full Tailwind-style palette is overhead. Keep it only if exposing raw color primitives for consumer use (e.g., marketing pages, illustrations). If keeping it, consider defining those primitives in OKLCH rather than hex — it makes the scale mathematically consistent and lets you add/remove stops programmatically.

---

## Next Steps

- [ ] Expand the shade ramp to 8-12 stops using `oklch` mixing, with semantic aliases
- [ ] Remove the per-theme percentage variables — let the foreground/background flip handle it
- [x] Adopt `light-dark()` for the base foreground/background definitions
- [x] Build out tone palettes with surface, border, and foreground variants
- [ ] Add a Figma export build step that resolves dynamic values to static hex
- [ ] Audit `colors.tokens.json` — either make it the source for tone bases or remove the neutral scale entirely since grays are generated dynamically
