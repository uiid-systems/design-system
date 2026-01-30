# Stack

> Vertical flex layout (column). ax controls vertical alignment, ay controls horizontal

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
| `p` | `number` | — | — |
| `pb` | `number` | — | — |
| `pl` | `number` | — | — |
| `pr` | `number` | — | — |
| `pt` | `number` | — | — |
| `px` | `number` | — | — |
| `py` | `number` | — | — |

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

## Common Patterns

### Full-width children with `ax="stretch"`

Use `ax="stretch"` to make all children fill the available width. This is the standard pattern for form layouts, stacked inputs, and any vertical layout where children should be full-width — including Group children.

```tsx
// DON'T — per-child inline styles or props
<Stack gap={4}>
  <Input style={{ width: "100%" }} label="Name" />
  <Group fullwidth gap={2}>
    <Input label="City" />
    <Input label="State" />
  </Group>
</Stack>

// DO — stretch from the parent cascades to all children
<Stack ax="stretch" gap={4}>
  <Input label="Name" />
  <Group gap={2}>
    <Input label="City" />
    <Input label="State" />
  </Group>
</Stack>
```

### Centered content

Use `ax="center"` for horizontal centering and `ay="center"` for vertical centering within the stack.

```tsx
// DON'T
<Stack style={{ alignItems: "center", justifyContent: "center", height: "100%" }}>
  <Text>Centered</Text>
</Stack>

// DO
<Stack ax="center" ay="center" fullheight>
  <Text>Centered</Text>
</Stack>
```

## See Also

- [Group](../group/README.md) - Horizontal layout component
- [Box](../box/README.md) - Underlying primitive with style props
- [Separator](../separator/README.md) - Divider for stacks
