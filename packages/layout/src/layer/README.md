# Layer

> Positioned layer with offset support for overlays and positioned content

## Quick Reference

```tsx
import { Layer } from "@uiid/layout";

// Layout properties
<Layer ax="center" ay="center" />

// Offset for stacking effects
<Layer offset={{ x: -8 }} />
<Layer offset={{ x: 4, y: 4 }} />

// Spacing properties (inherits from Box)
<Layer p={1} px={1} py={1} pl={1} pr={1} pt={1} pb={1} />
<Layer m={1} mx={1} my={1} ml={1} mr={1} mt={1} mb={1} />

// Sizing properties
<Layer fullwidth fullheight />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ax` | `"start" \| "center" \| "end" \| "space-between" \| "stretch"` | — | — |
| `ay` | `"start" \| "center" \| "end" \| "baseline" \| "stretch"` | — | — |
| `b` | `number` | — | — |
| `bb` | `number` | — | — |
| `bl` | `number` | — | — |
| `br` | `number` | — | — |
| `bt` | `number` | — | — |
| `bx` | `number` | — | — |
| `by` | `number` | — | — |
| `direction` | `"column" \| "row"` | — | — |
| `evenly` | `boolean` | — | — |
| `fullheight` | `boolean` | — | — |
| `fullscreen` | `boolean` | — | — |
| `fullwidth` | `boolean` | — | — |
| `gap` | `number` | — | — |
| `m` | `number \| "auto"` | — | — |
| `mb` | `number \| "auto"` | — | — |
| `ml` | `number \| "auto"` | — | — |
| `mr` | `number \| "auto"` | — | — |
| `mt` | `number \| "auto"` | — | — |
| `mx` | `number \| "auto"` | — | — |
| `my` | `number \| "auto"` | — | — |
| `offset` | `object` | — | — |
| `p` | `number` | — | — |
| `pb` | `number` | — | — |
| `pl` | `number` | — | — |
| `pr` | `number` | — | — |
| `pt` | `number` | — | — |
| `px` | `number` | — | — |
| `py` | `number` | — | — |

> Inherits all [Box](../box/README.md) props (spacing, sizing, render).

## Data Slots

| Slot    | Element            |
| ------- | ------------------ |
| `layer` | Root layer element |

## See Also

- [Box](../box/README.md) - Underlying primitive
- [Stack](../stack/README.md) - Vertical stacking (not overlapping)
- [Group](../group/README.md) - Horizontal layout
