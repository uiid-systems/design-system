# Token Architecture Plan

## Context

The `@uiid/tokens` package is the single source of truth for design values across the
UIID design system. Currently, JSON token files are converted to CSS custom properties
via a custom generator script. The goal is to make this system spec-compliant,
multi-platform capable, and architecturally clean -- without dramatic paradigm shifts.

This plan targets compliance with the
[Design Tokens Format Module 2025.10](https://www.designtokens.org/tr/drafts/format/)
specification.

---

## Spec Compliance Audit

Current issues against the 2025.10 spec:

| Issue | Current | Spec Requirement |
|-------|---------|-----------------|
| `$schema` URL | Points to community group draft | Should reference the 2025.10 spec or be removed |
| Color values | `oklch(0.63 0.24 27)`, `color-mix(...)`, `light-dark(...)` | Colors must be sRGB hex (`#rrggbb` or `#rrggbbaa`) |
| Font families | `$type: "string"` | Must use `$type: "fontFamily"` |
| Font weight | `$type: "fontWeight"` with string values like `"600"` | Values should be numbers (1-1000), not strings |
| Typography | Individual tokens for size/weight/lineHeight | Could use composite `typography` type |
| Derived values | CSS functions embedded in `$value` | `$value` must be a literal or alias; derivation logic belongs in `$extensions` |
| Percentages | `"80%"`, `"140%"` used as dimension values | `dimension` type requires `px` or `rem` units only |

### The core problem

CSS-specific functions (`color-mix`, `light-dark`, `oklch`) are embedded directly in
`$value` fields. This makes the JSON a CSS intermediate format rather than a
platform-agnostic source of truth. Per the spec, `$value` must contain a resolved
literal or an alias reference -- not a platform-specific expression.

---

## Architecture Changes

### 1. Reorganize JSON into tiers

Current flat structure:

```
src/json/
  avatar.tokens.json
  badge.tokens.json
  button.tokens.json
  colors.tokens.json
  ...
```

Proposed tiered structure:

```
src/json/
  primitives/
    colors.tokens.json      # Raw color values (hex), spacing scale, typography scale
    spacing.tokens.json
    typography.tokens.json
  semantic/
    shade.tokens.json        # Foreground/background/surface/accent aliases
    tone.tokens.json         # Positive/warning/critical/info
    globals.tokens.json      # Border, outline, transition, disabled, z-index
    forms.tokens.json        # Shared form sizing/padding (used by button, input, etc.)
  component/
    avatar.tokens.json
    badge.tokens.json
    button.tokens.json
    card.tokens.json
    checkbox.tokens.json
    code.tokens.json
    drawer.tokens.json
    list.tokens.json
    modal.tokens.json
    overlays.tokens.json
    popover.tokens.json
    sidebar.tokens.json
    switch.tokens.json
    table.tokens.json
    tabs.tokens.json
```

**Why tiers matter:**

- **Primitives** are the raw palette. They change rarely. Consumers outside the design
  system should almost never reference these directly.
- **Semantic** tokens give meaning to primitives. These are the primary public API for
  consumers. `shade.foreground` means something; `color.black` does not.
- **Component** tokens are internal to the design system. They reference semantic tokens
  and exist to make component CSS readable. Consumers should not use these directly.

All three tiers stay in `@uiid/tokens`. This preserves the current single-package model
and avoids introducing build dependencies between component packages and token generation.

### 2. Make color tokens spec-compliant

**Before (current):**

```json
{
  "color": {
    "red": { "$value": "oklch(0.63 0.24 27)", "$type": "color" }
  },
  "shade": {
    "1": {
      "$value": "color-mix(in oklch, {shade.foreground}, {shade.background} 97%)",
      "$type": "color"
    },
    "background": {
      "$value": "light-dark({color.white}, {color.black})",
      "$type": "color"
    }
  }
}
```

**After (spec-compliant):**

```json
{
  "color": {
    "$type": "color",
    "white": { "$value": "#fefefa" },
    "black": { "$value": "#0d0d0d" },
    "red": {
      "$value": "#d93a2b",
      "$extensions": {
        "org.uiid.oklch": { "l": 0.63, "c": 0.24, "h": 27 }
      }
    },
    "orange": {
      "$value": "#d4882a",
      "$extensions": {
        "org.uiid.oklch": { "l": 0.75, "c": 0.18, "h": 55 }
      }
    }
  }
}
```

The `$value` is a resolved sRGB hex color (spec-compliant, works everywhere). The
`$extensions` field preserves the oklch source values as structured data using reverse
domain notation per spec. The CSS adapter reads the extension and outputs `oklch()`
instead of hex when generating CSS, because CSS supports it natively. Other adapters
use the hex value.

**For derived/computed colors (shade scale, tones):**

```json
{
  "shade": {
    "$type": "color",
    "1": {
      "$value": "#0f0f0f",
      "$extensions": {
        "org.uiid.derive": {
          "method": "mix",
          "colorSpace": "oklch",
          "color1": "{shade.foreground}",
          "color2": "{shade.background}",
          "weight": 0.03
        }
      }
    },
    "background": {
      "$value": "#fefefa",
      "$extensions": {
        "org.uiid.derive": {
          "method": "light-dark",
          "light": "{color.white}",
          "dark": "{color.black}"
        }
      }
    },
    "surface": { "$value": "{shade.4}" },
    "accent": { "$value": "{shade.5}" },
    "foreground": {
      "$value": "#0d0d0d",
      "$extensions": {
        "org.uiid.derive": {
          "method": "light-dark",
          "light": "{color.black}",
          "dark": "{color.white}"
        }
      }
    }
  }
}
```

**How this works per adapter:**

| Adapter | Reads | Outputs |
|---------|-------|---------|
| CSS | `org.uiid.derive` extension | `color-mix(in oklch, ...)`, `light-dark(...)` |
| Figma | `$value` (hex) | Static resolved colors |
| iOS | `$value` (hex) or extension | `UIColor` / dynamic color assets |
| Android | `$value` (hex) | XML color resources |

The `$value` always contains a valid, resolved fallback. The extension describes the
dynamic derivation for platforms that support it.

### 3. Fix type compliance across all files

| File | Change |
|------|--------|
| `typography.tokens.json` | `$type: "string"` on fonts becomes `$type: "fontFamily"`. Values become arrays: `["ui-monospace", "SFMono-Regular", ...]`. Font weight values become numbers (`600` not `"600"`). Percentage lineHeight values get `$type: "number"` with decimal values (1.4 not "140%"). |
| `forms.tokens.json` | Fix inconsistent naming: `backgroundHover` becomes `background-hover`, `fontSize` becomes `font-size` throughout. Fix `$description` (currently says "Button Component Tokens"). |
| `globals.tokens.json` | Shadow token uses composite `shadow` type with structured value. |
| All files | Remove `$schema` pointing to old draft. Group-level `$type` inheritance where possible to reduce repetition. |

### 4. Normalize naming conventions

Adopt a single convention for all token names: **kebab-case**.

Current inconsistencies:
- `backgroundHover` vs `bg-hover`
- `fontSize` vs `font-size`
- `padding.x` (nesting) vs `padding-x` (flat)

Rule: Token object keys use kebab-case. Nesting is used for logical grouping, not for
creating compound property names. This means `padding.x` (nested) is correct,
`paddingX` (camelCase) and `padding-x` (flat with hyphen in key) are not.

After normalization:

```json
{
  "forms": {
    "background": { "$value": "..." },
    "background-hover": { "$value": "..." },
    "size": {
      "small": {
        "font-size": { "$value": "..." },
        "height": { "$value": "..." },
        "padding-x": { "$value": "..." }
      }
    }
  }
}
```

### 5. Restructure globals.css (separation of concerns)

Current `globals.css` conflates four things: layer declarations, token imports, CSS
reset, and base component styles. Split into:

```
src/
  layers.css          # @layer declarations only
  tokens.css          # Imports all primitive + semantic token CSS files
  reset.css           # Box-sizing, margin resets, font smoothing
  base.css            # Base element styles (a, body, [data-is-popup], .sr-only)
  globals.css         # Imports all of the above in order (entry point)
```

This way, consumers who only want tokens can import `@uiid/tokens/tokens.css`. Those
who want the full setup import `@uiid/tokens/globals.css` as before.

### 6. Update the CSS layer architecture

Current layers:

```css
@layer uiid.globals, uiid.tokens, uiid.components, uiid.utilities;
```

Each token file generates into `@layer uiid.tokens.<name>`. This is fine but the
sub-layer ordering is implicit. Proposed explicit ordering in `layers.css`:

```css
@layer
  uiid.tokens.primitives,
  uiid.tokens.semantic,
  uiid.tokens.component,
  uiid.globals,
  uiid.components,
  uiid.utilities;
```

The generator maps tier directories to layer names:
- `primitives/colors.tokens.json` generates into `@layer uiid.tokens.primitives`
- `semantic/shade.tokens.json` generates into `@layer uiid.tokens.semantic`
- `component/button.tokens.json` generates into `@layer uiid.tokens.component`

All tokens in a tier share one layer. This reduces layer proliferation (from 20
individual layers to 3 tier layers) and makes the cascade predictable: primitives
first, then semantic overrides, then component-specific values.

### 7. Update the generator to support adapters

The current `generate-tokens.cjs` becomes the CSS adapter. The generator itself becomes
a pipeline:

```
src/
  ...
scripts/
  generate-tokens.cjs          # Entry point (orchestrator)
  adapters/
    css.cjs                     # CSS custom properties output (current logic, enhanced)
```

**Orchestrator responsibilities:**
- Discover and parse JSON files (as today)
- Resolve token tiers from directory structure
- Pass parsed tokens + tier info to the active adapter(s)
- Incremental build logic (as today)
- Watch mode (as today, via nodemon)

**CSS adapter responsibilities:**
- Generate CSS custom properties
- Read `org.uiid.oklch` extensions to output oklch() values instead of hex
- Read `org.uiid.derive` extensions to output color-mix()/light-dark()
- Generate `@layer` scoping based on tier
- Handle `{alias}` to `var(--alias)` conversion

**Future adapters (not in scope now, but the architecture supports them):**
- `figma.cjs` -- outputs Figma Variables JSON
- `swift.cjs` -- outputs Swift color/dimension constants
- `kotlin.cjs` -- outputs Android XML resources or Compose values

The adapter interface is simple:

```js
module.exports = {
  name: 'css',
  fileExtension: '.tokens.css',
  generate(tokens, metadata) {
    // metadata: { tier, fileName, relativePath }
    // returns: string (file content)
  }
}
```

### 8. Split colors.tokens.json into three files

The current `colors.tokens.json` contains three conceptually distinct groups:

- **Primitive colors** (`color.*`) -- the raw palette
- **Shade scale** (`shade.*`) -- neutral derived scale + semantic aliases
- **Tones** (`tone.*`) -- status colors with surface/border/foreground variants

These map cleanly to the tier structure:

```
primitives/colors.tokens.json    # color.white, color.black, color.red, ...
semantic/shade.tokens.json       # shade.1-12, shade.background, shade.foreground, ...
semantic/tone.tokens.json        # tone.positive, tone.critical, ...
```

This is the single highest-impact change for clarity. Right now, a developer looking at
`colors.tokens.json` sees 130 lines mixing raw values with derived scales with semantic
aliases. After the split, each file is ~30-40 lines with a single purpose.

---

## Migration Strategy

### Phase 1: Spec compliance + naming normalization

1. Convert all color `$value` fields to sRGB hex, move oklch to `$extensions`
2. Add `org.uiid.derive` extensions for all computed colors
3. Fix `$type` values (`fontFamily`, number font weights, etc.)
4. Normalize all token names to kebab-case
5. Fix `$description` fields that are wrong (forms says "Button")
6. Update generator to read extensions and produce the same CSS output as today

**Result:** JSON is spec-compliant. CSS output is identical. Nothing downstream breaks.

### Phase 2: Reorganize into tiers

1. Create `primitives/`, `semantic/`, `component/` directories under `src/json/`
2. Split `colors.tokens.json` into `primitives/colors.tokens.json`,
   `semantic/shade.tokens.json`, `semantic/tone.tokens.json`
3. Move remaining files into appropriate tier directories
4. Update generator to derive layer names from tier directories
5. Update `globals.css` imports to point to new CSS output paths
6. Update component package imports (`@uiid/tokens/button.tokens.css` becomes
   `@uiid/tokens/component/button.tokens.css` -- or keep old paths via package exports)

**Result:** Clean tier separation. Minimal downstream changes if package exports
provide backwards-compatible paths.

### Phase 3: Split globals.css

1. Extract layer declarations into `layers.css`
2. Extract reset styles into `reset.css`
3. Extract base element styles into `base.css`
4. Create `tokens.css` as a tokens-only entry point
5. Keep `globals.css` as the all-in-one entry point that imports everything

**Result:** Consumers can opt into just tokens without the reset/base styles.

### Phase 4: Adapter architecture

1. Extract CSS generation logic from `generate-tokens.cjs` into `adapters/css.cjs`
2. Refactor `generate-tokens.cjs` into an orchestrator that loads adapters
3. Keep watch mode, incremental builds, force flag
4. Add adapter selection via CLI flag (default: css)

**Result:** Adding a Figma or native adapter is a new file, not a rewrite.

---

## What stays the same

- All tokens remain in `@uiid/tokens` (no moving to component packages)
- CSS custom properties as the primary output format
- `nodemon` watch task
- Component packages import token CSS via `@uiid/tokens/*` paths
- W3C Design Tokens JSON as the source format
- The overall `json -> generate -> css` pipeline
- Incremental build behavior

## What changes

- JSON values become spec-compliant (hex colors, proper types)
- CSS-specific derivation logic moves to `$extensions`
- Flat directory becomes three-tier directory
- One `colors.tokens.json` becomes three focused files
- `globals.css` splits into composable parts
- 20 CSS layers become 3 tier-based layers
- Generator gains adapter pattern (CSS adapter first)
- Naming conventions normalized to kebab-case throughout

## Open questions

1. **Package export paths:** When token files move into tier subdirectories, should we
   update all component imports (`@uiid/tokens/component/button.tokens.css`) or add
   export aliases to maintain the current flat paths? Export aliases are simpler
   short-term but hide the tier structure.

2. **Hex fallback values:** For derived colors (shade scale, tones), the `$value` needs
   a resolved hex color. Should we compute these once by hand and hardcode them, or
   write a small script that resolves the color math and fills in `$value` fields?
   Hardcoded values are simpler but can drift from the derivation logic.

3. **Typography composite type:** The spec supports a composite `typography` type that
   bundles fontFamily, fontSize, fontWeight, and lineHeight into one token. Should
   the text scale (`typography.text.0`, `typography.text.1`, etc.) use this, or keep
   individual tokens? Individual tokens are more granular for CSS variable usage.
