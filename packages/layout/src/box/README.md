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

| Prop        | Type                                        | Default   | Description                                 |
| ----------- | ------------------------------------------- | --------- | ------------------------------------------- |
| `gap`       | `number`                                    | —         | Space between children (uses spacing scale) |
| `ax`        | `"start" \| "center" \| "end" \| "stretch"` | —         | Justify content                             |
| `ay`        | `"start" \| "center" \| "end" \| "stretch"` | —         | Align items                                 |
| `direction` | `"row" \| "column"`                         | —         | Flex direction                              |
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
| `fullheight`| `boolean`                                   | `false`   | Stretch to fill container height            |
| `evenly`    | `boolean`                                   | `false`   | Distribute children evenly                  |
| `render`    | `ReactElement`                              | `<div />` | Custom element to render as                 |
| `className` | `string`                                    | —         | Additional CSS classes                      |
| `style`     | `CSSProperties`                             | —         | Inline styles                               |

## Data Slots

| Slot  | Element          |
| ----- | ---------------- |
| `box` | Root box element |

## See Also

- [Stack](../stack/README.md) - Vertical layout (uses Box)
- [Group](../group/README.md) - Horizontal layout (uses Box)
- [Layer](../layer/README.md) - Overlapping layers (uses Box)
