# Layer

> A layout component for stacking children on top of each other, with optional offset for visual effects like avatar stacks.

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

| Prop        | Type                                        | Default   | Description                   |
| ----------- | ------------------------------------------- | --------- | ----------------------------- |
| `offset`    | `{ x?: number; y?: number }`                | —         | Pixel offset per child        |
| `ax`        | `"start" \| "center" \| "end" \| "stretch"` | —         | Horizontal alignment          |
| `ay`        | `"start" \| "center" \| "end" \| "stretch"` | —         | Vertical alignment            |
| `className` | `string`                                    | —         | Additional CSS classes        |
| `style`     | `CSSProperties`                             | —         | Inline styles                 |

> Inherits all Box props (padding, margin, fullwidth, fullheight, etc.)

## Data Slots

| Slot    | Element            |
| ------- | ------------------ |
| `layer` | Root layer element |

## See Also

- [Box](../box/README.md) - Underlying primitive
- [Stack](../stack/README.md) - Vertical stacking (not overlapping)
- [Group](../group/README.md) - Horizontal layout
