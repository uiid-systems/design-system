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

| Prop        | Type                                        | Default   | Description                                 |
| ----------- | ------------------------------------------- | --------- | ------------------------------------------- |
| `gap`       | `number`                                    | —         | Space between children (uses spacing scale) |
| `ax`        | `"start" \| "center" \| "end" \| "stretch"` | —         | Horizontal distribution                     |
| `ay`        | `"start" \| "center" \| "end" \| "stretch"` | —         | Vertical alignment                          |
| `p`         | `number`                                    | —         | Padding on all sides                        |
| `px`        | `number`                                    | —         | Horizontal padding                          |
| `py`        | `number`                                    | —         | Vertical padding                            |
| `pt`        | `number`                                    | —         | Padding top                                 |
| `pr`        | `number`                                    | —         | Padding right                               |
| `pb`        | `number`                                    | —         | Padding bottom                              |
| `pl`        | `number`                                    | —         | Padding left                                |
| `m`         | `number`                                    | —         | Margin on all sides                         |
| `mx`        | `number`                                    | —         | Horizontal margin                           |
| `my`        | `number`                                    | —         | Vertical margin                             |
| `mt`        | `number`                                    | —         | Margin top                                  |
| `mr`        | `number`                                    | —         | Margin right                                |
| `mb`        | `number`                                    | —         | Margin bottom                               |
| `ml`        | `number`                                    | —         | Margin left                                 |
| `fullwidth` | `boolean`                                   | `false`   | Stretch to fill container width             |
| `evenly`    | `boolean`                                   | `false`   | Distribute children evenly                  |
| `render`    | `ReactElement`                              | `<div />` | Custom element to render as                 |
| `className` | `string`                                    | —         | Additional CSS classes                      |

## Data Slots

| Slot    | Element            |
| ------- | ------------------ |
| `group` | Root group element |

## See Also

- [Stack](../stack/README.md) - Vertical layout component
- [Box](../box/README.md) - Underlying primitive with style props
- [Separator](../separator/README.md) - Divider for groups
