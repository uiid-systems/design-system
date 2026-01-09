# Stack

> A vertical layout component for stacking children from top to bottom with consistent spacing.

## Quick Reference

```tsx
import { Stack } from "@uiid/layout";

// Layout properties
<Stack ay="center" ax="between" gap={2} />

// Spacing properties
<Stack p={1} px={1} py={1} pl={1} pr={1} pt={1} pb={1} />
<Stack m={1} mx={1} my={1} ml={1} mr={1} mt={1} mb={1} />

// Sizing properties
<Stack fullwidth fullheight />

// Render a custom element
<Stack render={<main />} />

// Custom-rendered elements can receive props
<Stack render={<ul className="list" />} />
```

## Props

Stack swaps `ax` and `ay` to be intuitive in a vertical context.

| Prop         | Type                                                                                                                   | Default   | Description                      |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- | --------- | -------------------------------- |
| `ax`         | `"baseline" \| "center" \| "end" \| "start" \| "stretch"`                                                              | —         | Horizontal alignment             |
| `ay`         | `"space-around" \| "baseline" \| "space-between" \| "center" \| "end" \| "evenly" \| "normal" \| "start" \| "stretch"` | —         | Vertical distribution            |
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
| `render`     | `ReactElement`                                                                                                         | `<div />` | Custom element to render as      |
| `className`  | `string`                                                                                                               | —         | Additional CSS classes           |

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

| Slot    | Element            |
| ------- | ------------------ |
| `stack` | Root stack element |

## See Also

- [Group](../group/README.md) - Horizontal layout component
- [Box](../box/README.md) - Underlying primitive with style props
- [Separator](../separator/README.md) - Divider for stacks
