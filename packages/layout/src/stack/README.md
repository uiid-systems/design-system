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

| Prop         | Type                                        | Default   | Description                                 |
| ------------ | ------------------------------------------- | --------- | ------------------------------------------- |
| `gap`        | `number`                                    | —         | Space between children (uses spacing scale) |
| `ax`         | `"start" \| "center" \| "end" \| "stretch"` | —         | Horizontal alignment                        |
| `ay`         | `"start" \| "center" \| "end" \| "stretch"` | —         | Vertical distribution                       |
| `p`          | `number`                                    | —         | Padding on all sides                        |
| `px`         | `number`                                    | —         | Horizontal padding                          |
| `py`         | `number`                                    | —         | Vertical padding                            |
| `pt`         | `number`                                    | —         | Padding top                                 |
| `pr`         | `number`                                    | —         | Padding right                               |
| `pb`         | `number`                                    | —         | Padding bottom                              |
| `pl`         | `number`                                    | —         | Padding left                                |
| `m`          | `number`                                    | —         | Margin on all sides                         |
| `mx`         | `number`                                    | —         | Horizontal margin                           |
| `my`         | `number`                                    | —         | Vertical margin                             |
| `mt`         | `number`                                    | —         | Margin top                                  |
| `mr`         | `number`                                    | —         | Margin right                                |
| `mb`         | `number`                                    | —         | Margin bottom                               |
| `ml`         | `number`                                    | —         | Margin left                                 |
| `fullwidth`  | `boolean`                                   | `false`   | Stretch to fill container width             |
| `fullheight` | `boolean`                                   | `false`   | Stretch to fill container height            |
| `render`     | `ReactElement`                              | `<div />` | Custom element to render as                 |
| `className`  | `string`                                    | —         | Additional CSS classes                      |

## Data Slots

| Slot    | Element            |
| ------- | ------------------ |
| `stack` | Root stack element |

## See Also

- [Group](../group/README.md) - Horizontal layout component
- [Box](../box/README.md) - Underlying primitive with style props
- [Separator](../separator/README.md) - Divider for stacks
