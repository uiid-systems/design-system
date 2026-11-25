# @uiid/tokens

> Design tokens for UIID. Ships colour ramps, the semantic palette, spacing, typography, semantic and component tokens as CSS custom properties, the shared compositions and style-prop rules, plus the TypeScript types that describe the palette.

## What it ships

The token JSON in `src/json/` (`primitives/`, `semantic/`, `theme/` and `component/`) is the source of truth. `build-tokens.js` turns each `*.tokens.json` file into a matching `*.tokens.css` file under `src/css/`, every value in the `uiid.tokens` layer.

| Import                                     | What it is                                                                                                                             |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `@uiid/tokens/globals.css`                 | The cascade layer order, the primitive, semantic, theme and tooltip tokens, the palette, compositions, style-prop rules and animations |
| `@uiid/tokens/compositions.css`            | The global `composes-*` classes that component CSS modules compose                                                                     |
| `@uiid/tokens/component/{name}.tokens.css` | One component's tokens, imported by that component's CSS module                                                                        |
| `@uiid/tokens`                             | The palette's TypeScript exports (below)                                                                                               |

`src/props.css` is generated from the style props in `@uiid/utils` by `pnpm generate:props`; never edit it by hand.

## The palette

The semantic palette contract — the nine `--palette-*` custom properties, which surface each is measured against, and why the classes are global rather than CSS Modules — is documented in the header of **`src/palette.css`**, next to the values it describes. Read that file; it is the source of truth and cannot drift from the values themselves.

Components never name a hue or a step. They apply `.palette-<hue>` and read the contract names, which is why a Button and a Card tinted the same colour cannot drift apart.

Eight hues: `red`, `orange`, `yellow`, `green`, `blue`, `indigo`, `purple`, `neutral`.

## Why the ramps are hand-authored

`src/json/primitives/colors.tokens.json` holds the eight ramps as plain hex, steps 50–950. They are **authored, not generated**, and each hue's `500` **is** its authored anchor — so a ramp contains the colour it is named after by construction.

Generation was abandoned rather than fixed, for two reasons worth not rediscovering:

- The old `generateColorScale` accepted a `baseL` and never used it, pinning every `500` to `L=0.58`. All seven hues then failed to contain their own anchor — `yellow #e8b700` generated as `#a17200`.
- The old converter clipped each channel independently, which shifts hue (`purple-50` read pink). The current ramps were produced once, offline, with **gamut mapping** instead: chroma is reduced until the colour fits sRGB while holding lightness and hue.

There is no colour maths in the ramps. Each hue's palette values are plain `var()` references to a primitive, picked per scheme with `light-dark()`. The one derived value is `--palette-tint-hover`, a `color-mix()` of `--shade-foreground` into `--palette-tint`; the header of `src/palette.css` says why.

## Theming

Colors follow the system preference by default. Set `data-theme="light"` or `data-theme="dark"` on `<html>` to force a scheme for the whole page, or on any element to theme just that section; a themed section also repaints its own text and background.

Portalled overlays such as Dialog, Popover, Menu and Tooltip render at the end of `<body>`, outside any themed section, so they take the root scheme.

## TypeScript exports

`src/palette.ts` derives its types from the token JSON, so the union cannot drift from the ramps:

| Export                       | Purpose                                                    |
| ---------------------------- | ---------------------------------------------------------- |
| `PaletteColor`               | Union of the eight hue names                               |
| `PALETTE_HUES`               | The hue names as an array                                  |
| `paletteColorStyles`         | Map of hue to its `.palette-<hue>` class name              |
| `paletteClassName(hue, cls)` | The hue class plus a component's treatment class, or none  |
| `paletteVariantStyles(cls)`  | The same pairing for every hue, shaped for a `cva` variant |

An entry counts as a hue only if it has a `500` step, which is what keeps `white`/`black` and DTCG `$` metadata out of the union.
