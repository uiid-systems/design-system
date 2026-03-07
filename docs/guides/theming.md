# Theming Guide

Create a custom theme for UIID in minutes. Supply a color palette, run the generator, and get a CSS file that adapts the entire design system — shade scale, tone variants, component tokens — to your brand.

> For the internal architecture guide, see [`docs/architecture/theme-architecture.md`](../architecture/theme-architecture.md).

---

## Quick Start

### 1. Create a theme file

Create a JSON file with your brand colors. Only 5 fields are required:

```json
{
  "name": "MyBrand",
  "white": "#f8f9fa",
  "black": "#1a1a2e",
  "primary": "#e94560",
  "secondary": "#0f3460"
}
```

- **`white`** — your lightest neutral (light mode background, dark mode text)
- **`black`** — your darkest neutral (dark mode background, light mode text)
- **`primary`** — brand primary color (buttons, links, focus rings)
- **`secondary`** — brand secondary color (badges, accents)

### 2. Generate the theme

```bash
npx tsx scripts/generate-theme.js --input my-brand.theme.json --output my-brand.css
```

The generator will:
- Derive a full 12-step shade scale from your `white` and `black`
- Generate surface, border, and foreground variants for every theme color
- Check all color pairs for WCAG AA contrast compliance
- Output a single CSS file

### 3. Use the theme

Import the generated CSS after `globals.css`:

```css
@import "@uiid/tokens/globals.css";
@import "./my-brand.css";
```

That's it. Every UIID component automatically picks up your theme.

---

## Schema Reference

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `name` | Yes | — | Theme display name |
| `white` | Yes | — | Lightest neutral anchor |
| `black` | Yes | — | Darkest neutral anchor |
| `primary` | Yes | — | Brand primary color |
| `secondary` | Yes | — | Brand secondary color |
| `positive` | No | `#00c565` | Success/positive status color |
| `warning` | No | `#e8b700` | Warning status color |
| `critical` | No | `#f9262a` | Error/danger status color |
| `info` | No | `#347eff` | Informational status color |

All color values must be 6-digit hex strings (`#RRGGBB`). The generator handles all OKLCH conversion internally — you never need to work with OKLCH directly.

### What gets generated

From your 4-8 hex values, the generator produces:

- **12 shade steps** (`--shade-1` through `--shade-12`) — your neutral palette
- **Named shade aliases** (`--shade-background`, `--shade-foreground`, `--shade-surface`, etc.)
- **Theme color variants** — for each theme color, `-surface`, `-border`, and `-foreground` variants
- **Tone overrides** — if you specified `positive`, `warning`, `critical`, or `info`

Each value is a `light-dark()` pair, so light and dark mode work automatically.

---

## Example Themes

### Ocean

A cool blue palette. Only specifies the 5 required fields — tone colors use defaults.

```json
{
  "name": "Ocean",
  "white": "#f0f4f8",
  "black": "#0a1628",
  "primary": "#0077cc",
  "secondary": "#6b5ce7"
}
```

### Ember

A warm orange/red palette with earthy neutrals.

```json
{
  "name": "Ember",
  "white": "#fdf6f0",
  "black": "#1a0e05",
  "primary": "#e05a1a",
  "secondary": "#c4362a"
}
```

### Ayu

A complete theme with all 8 colors specified. Inspired by the popular editor theme.

```json
{
  "name": "Ayu",
  "white": "#fcfcfc",
  "black": "#1a1f29",
  "primary": "#d06818",
  "secondary": "#2b7cb5",
  "positive": "#5c7a00",
  "warning": "#b07a00",
  "critical": "#c74545",
  "info": "#2d8aab"
}
```

Preset themes are available at `packages/themes/src/presets/` and can be used directly or as starting points.

---

## Import from VSCode

Already have a color palette you love in your editor? Convert any VSCode theme into a UIID theme with one command.

### Convert a theme

```bash
npx tsx scripts/convert-vscode-theme.js --input dracula.json
```

This reads the VSCode theme JSON and outputs a UIID theme JSON to stdout. To write it to a file:

```bash
npx tsx scripts/convert-vscode-theme.js \
  --input dracula.json \
  --output dracula.theme.json \
  --name "Dracula"
```

Then generate the CSS as usual:

```bash
npx tsx scripts/generate-theme.js --input dracula.theme.json --output dracula.css
```

### Where to find VSCode themes

VSCode themes are JSON files. You can get them from:

- **Your current theme**: Open VSCode, run `Preferences: Open User Settings (JSON)`, find your theme's extension folder in `~/.vscode/extensions/`
- **Theme repositories**: Most popular themes are on GitHub (search for the theme name + "vscode")
- **VSIX files**: Download a `.vsix` from the marketplace, rename to `.zip`, extract, and find the theme JSON in `themes/`

### How the mapping works

The converter extracts colors from VSCode's `colors` object and maps them to UIID fields:

| UIID Field | VSCode Keys (first match wins) |
|------------|-------------------------------|
| `white` | Light: `editor.background` / Dark: `editor.foreground` |
| `black` | Light: `editor.foreground` / Dark: `editor.background` |
| `primary` | `focusBorder`, `button.background`, `textLink.foreground` |
| `secondary` | `badge.background`, `activityBar.activeBorder` |
| `positive` | `terminal.ansiGreen`, `gitDecoration.addedResourceForeground` |
| `warning` | `terminal.ansiYellow`, `list.warningForeground` |
| `critical` | `terminal.ansiRed`, `errorForeground` |
| `info` | `terminal.ansiBlue`, `editorInfo.foreground` |

The converter automatically detects light vs dark themes and flips the white/black mapping accordingly.

### Limitations

- **`include` directives**: VSCode themes can inherit from base themes via `include`. The converter doesn't resolve these — if colors are inherited rather than defined, they'll be missing. Workaround: use the fully-resolved theme file.
- **Neutral fidelity**: In dark themes, `white` comes from the editor foreground color, which is typically a muted gray rather than pure white. This preserves the theme's character but means neutrals may feel more subdued.
- **Semantic subset**: VSCode themes define hundreds of color keys. The converter maps ~30 of them to UIID's 8 fields. Syntax highlighting colors are not used.

---

## Theme Switching

### Light/dark mode

UIID uses the CSS `light-dark()` function. Every token has both a light and dark value baked in. The active mode is controlled by `color-scheme`:

- **System preference (default)**: no attribute needed — follows OS setting
- **Force light**: `<html data-theme="light">`
- **Force dark**: `<html data-theme="dark">`

### Programmatic toggle

```typescript
// Force dark mode
document.documentElement.setAttribute("data-theme", "dark");

// Follow system preference
document.documentElement.removeAttribute("data-theme");
```

The docs app includes a `useTheme` hook that manages this attribute and persists the choice to `localStorage` (key: `"uiid-theme"`). A `<script>` in `<head>` restores the preference before first paint to prevent flash.

### Swapping themes at runtime

To switch between theme CSS files (e.g., default vs ocean):

```html
<link id="uiid-theme" rel="stylesheet" href="/themes/default.css" />
```

```typescript
function setTheme(name: string) {
  const link = document.getElementById("uiid-theme") as HTMLLinkElement;
  link.href = `/themes/${name}.css`;
}
```

Since theme CSS files use unlayered `:root {}` rules, they override the default layered token values regardless of load order. Just make sure the theme CSS loads after `globals.css`.

---

## Contrast Validation

The generator automatically checks your theme for WCAG AA accessibility. You'll see output like:

```
[contrast] warning: primary (#0077cc) on background (#f0f4f8) — ratio 4.2:1 (minimum 4.5:1 for text)
[contrast] error: warning (#e8b700) on background (#f0f4f8) — ratio 2.1:1 (minimum 3.0:1 for UI)
```

### Warning levels

| Level | Meaning | Action |
|-------|---------|--------|
| **error** | Ratio below 3.0:1 | Color pair is likely unreadable — consider adjusting |
| **warning** | Ratio between 3.0:1 and 4.5:1 | Fine for large text/icons, may fail for body text |

Validation never blocks generation — your theme CSS is always produced. Treat warnings as guidance, not hard failures. Some pairs (like `warning` on a light background) are inherently low-contrast by nature and may be acceptable depending on usage.

### Manual check

To re-run validation without regenerating:

```bash
npx tsx scripts/generate-theme.js --input my-theme.json --dry-run
```

The `--dry-run` flag runs the full pipeline including contrast checks but skips writing the CSS file.

---

## Troubleshooting

### Low contrast warnings on every pair

Your `white` and `black` values are too close together. The shade scale is derived from these two anchors — if they don't have enough contrast, nothing downstream will either. Aim for at least 12:1 contrast between your `white` and `black`.

### Shade scale feels flat or muddy

This usually means your `white` or `black` has too much chroma (color saturation). Neutrals work best when they're close to achromatic. A slightly tinted neutral is fine (`#f0f4f8`), but a saturated one (`#a0c4f8`) will produce a shade scale that feels tinted at every step.

### Theme looks different from the VSCode original

Expected. UIID maps ~8 colors from a palette of hundreds. The converter preserves the overall feel (warm vs cool, light vs dark, accent colors) but doesn't attempt pixel-perfect reproduction. You can always hand-edit the generated theme JSON before running the CSS generator.

### Generated CSS has no effect

Check that your theme CSS loads **after** `globals.css`. Theme overrides use unlayered `:root {}` which beats the layered token declarations, but only if the stylesheet is actually loaded.

### Optional tone colors look wrong

If you didn't specify `positive`, `warning`, `critical`, or `info`, they fall back to the built-in defaults. These defaults are designed for the default neutral palette — they may not harmonize with your custom `white`/`black`. For best results, specify all 8 colors.
