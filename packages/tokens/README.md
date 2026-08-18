# @uiid/tokens

> Design tokens for UIID. Ships colour ramps, the semantic palette, spacing, and
> typography primitives as CSS custom properties, plus the TypeScript types that
> describe them.

## The palette

The semantic palette contract — the eight `--palette-*` custom properties, which
surface each is measured against, and why the classes are global rather than CSS
Modules — is documented in the header of **`src/palette.css`**, next to the values
it describes. Read that file; it is the source of truth and cannot drift from the
values themselves.

Components never name a hue or a step. They apply `.palette-<hue>` and read the
contract names, which is why a Button and a Card tinted the same colour cannot
drift apart.

Eight hues: `red`, `orange`, `yellow`, `green`, `blue`, `indigo`, `purple`,
`neutral`.

## Why the ramps are hand-authored

`src/json/primitives/colors.tokens.json` holds the eight ramps as plain hex,
steps 50–950. They are **authored, not generated**, and each hue's `500` **is**
its authored anchor — so a ramp contains the colour it is named after by
construction.

Generation was abandoned rather than fixed, for two reasons worth not
rediscovering:

- The old `generateColorScale` accepted a `baseL` and never used it, pinning
  every `500` to `L=0.58`. All seven hues then failed to contain their own
  anchor — `yellow #e8b700` generated as `#a17200`.
- The old converter clipped each channel independently, which shifts hue
  (`purple-50` read pink). The current ramps were produced once, offline, with
  **gamut mapping** instead: chroma is reduced until the colour fits sRGB while
  holding lightness and hue.

There is no colour maths at render time. `light-dark()` is the only derive
method; every palette value is a plain `var()` reference to a primitive.

## TypeScript exports

`src/palette.ts` derives its types from the token JSON, so the union cannot drift
from the ramps:

| Export               | Purpose                                       |
| -------------------- | --------------------------------------------- |
| `PaletteColor`       | Union of the eight hue names                  |
| `PALETTE_HUES`       | The hue names as an array                     |
| `paletteAnchor(hue)` | The authored anchor hex for a hue             |
| `paletteColorStyles` | Map of hue to its `.palette-<hue>` class name |

An entry counts as a hue only if it has a `500` step, which is what keeps
`white`/`black` and DTCG `$` metadata out of the union.
