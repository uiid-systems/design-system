# Group

> A horizontal layout component for arranging children side by side with consistent spacing.

## Quick Reference

```tsx
import { Group } from "@uiid/layout";

// Layout properties
<Group ay="center" ax="between" gap={2} />

// Spacing properties
<Group p={1} px={1} py={1} pl={1} pr={1} pt={1} pb={1} />
<Group m={1} mx={1} my={1} ml={1} mr={1} mt={1} mb={1} />

// Evenly distributed, fullwidth
<Group evenly fullwidth />

// Render a custom element
<Group render={<main />} />

// Custom-rendered elements can receive props
<Group render={<a href="#" />} />
```

## Props

| Prop        | Type                                                                                                                   | Default   | Description                     |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------- |
| `ax`        | `"space-around" \| "baseline" \| "space-between" \| "center" \| "end" \| "evenly" \| "normal" \| "start" \| "stretch"` | —         | Horizontal distribution         |
| `ay`        | `"baseline" \| "center" \| "end" \| "start" \| "stretch"`                                                              | —         | Vertical alignment              |
| `gap`       | `SpacingValue`                                                                                                         | —         | Space between children          |
| `p`         | `SpacingValue`                                                                                                         | —         | Padding on all sides            |
| `px`        | `SpacingValue`                                                                                                         | —         | Horizontal padding              |
| `py`        | `SpacingValue`                                                                                                         | —         | Vertical padding                |
| `pt`        | `SpacingValue`                                                                                                         | —         | Padding top                     |
| `pr`        | `SpacingValue`                                                                                                         | —         | Padding right                   |
| `pb`        | `SpacingValue`                                                                                                         | —         | Padding bottom                  |
| `pl`        | `SpacingValue`                                                                                                         | —         | Padding left                    |
| `m`         | `SpacingValue`                                                                                                         | —         | Margin on all sides             |
| `mx`        | `SpacingValue`                                                                                                         | —         | Horizontal margin               |
| `my`        | `SpacingValue`                                                                                                         | —         | Vertical margin                 |
| `mt`        | `SpacingValue`                                                                                                         | —         | Margin top                      |
| `mr`        | `SpacingValue`                                                                                                         | —         | Margin right                    |
| `mb`        | `SpacingValue`                                                                                                         | —         | Margin bottom                   |
| `ml`        | `SpacingValue`                                                                                                         | —         | Margin left                     |
| `fullwidth` | `boolean`                                                                                                              | `false`   | Stretch to fill container width |
| `evenly`    | `boolean`                                                                                                              | `false`   | Distribute children evenly      |
| `render`    | `ReactElement`                                                                                                         | `<div />` | Custom element to render as     |
| `className` | `string`                                                                                                               | —         | Additional CSS classes          |

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
| `group` | Root group element |

## See Also

- [Stack](../stack/README.md) - Vertical layout component
- [Box](../box/README.md) - Underlying primitive with style props
- [Separator](../separator/README.md) - Divider for groups
