# Box

> A polymorphic primitive component with style props for spacing, layout, and sizing. The foundation for Stack, Group, and Layer.

## Quick Reference

```tsx
import { Box } from "@uiid/layout";

// Layout properties
<Box ax="center" ay="center" direction="column" gap={2} />

// Spacing properties
<Box p={1} px={1} py={1} pl={1} pr={1} pt={1} pb={1} />
<Box m={1} mx={1} my={1} ml={1} mr={1} mt={1} mb={1} />

// Sizing properties
<Box fullwidth fullheight evenly />

// Render a custom element
<Box render={<section />} />

// Custom-rendered elements can receive props
<Box render={<form onSubmit={handleSubmit} />} />
```

## Props

| Prop         | Type                                                                                                                   | Default   | Description                      |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- | --------- | -------------------------------- |
| `ax`         | `"space-around" \| "baseline" \| "space-between" \| "center" \| "end" \| "evenly" \| "normal" \| "start" \| "stretch"` | —         | Justify content                  |
| `ay`         | `"baseline" \| "center" \| "end" \| "start" \| "stretch"`                                                              | —         | Align items                      |
| `direction`  | `"column" \| "row"`                                                                                                    | —         | Flex direction                   |
| `gap`        | `SpacingValue`                                                                                                         | —         | Space between children           |
| `p`          | `SpacingValue`                                                                                                         | —         | Padding on all sides             |
| `px`         | `SpacingValue`                                                                                                         | —         | Horizontal padding               |
| `py`         | `SpacingValue`                                                                                                         | —         | Vertical padding                 |
| `pt`         | `SpacingValue`                                                                                                         | —         | Padding top                      |
| `pr`         | `SpacingValue`                                                                                                         | —         | Padding right                    |
| `pb`         | `SpacingValue`                                                                                                         | —         | Padding bottom                   |
| `pl`         | `SpacingValue`                                                                                                         | —         | Padding left                     |
| `m`          | `SpacingValue`                                                                                                         | —         | Margin on all sides              |
| `mx`         | `SpacingValue`                                                                                                         | —         | Horizontal margin                |
| `my`         | `SpacingValue`                                                                                                         | —         | Vertical margin                  |
| `mt`         | `SpacingValue`                                                                                                         | —         | Margin top                       |
| `mr`         | `SpacingValue`                                                                                                         | —         | Margin right                     |
| `mb`         | `SpacingValue`                                                                                                         | —         | Margin bottom                    |
| `ml`         | `SpacingValue`                                                                                                         | —         | Margin left                      |
| `fullwidth`  | `boolean`                                                                                                              | `false`   | Stretch to fill container width  |
| `fullheight` | `boolean`                                                                                                              | `false`   | Stretch to fill container height |
| `evenly`     | `boolean`                                                                                                              | `false`   | Distribute children evenly       |
| `render`     | `ReactElement`                                                                                                         | `<div />` | Custom element to render as      |
| `className`  | `string`                                                                                                               | —         | Additional CSS classes           |
| `style`      | `CSSProperties`                                                                                                        | —         | Inline styles                    |

```tsx
type SpacingValue =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 6
  | 8
  | 10
  | 12
  | 16
  | 20
  | 24
  | 32
  | 40
  | 48
  | 56
  | 64;
```

## Data Slots

| Slot  | Element          |
| ----- | ---------------- |
| `box` | Root box element |

## See Also

- [Stack](../stack/README.md) - Vertical layout (uses Box)
- [Group](../group/README.md) - Horizontal layout (uses Box)
- [Layer](../layer/README.md) - Overlapping layers (uses Box)
