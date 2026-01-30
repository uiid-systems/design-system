# Group

> Horizontal flex layout (row). ax controls horizontal alignment, ay controls vertical

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

## Common Patterns

### Equal-width children

Use `evenly` instead of applying `flex: 1` or `style={{ flex: 1 }}` to each child.

```tsx
// DON'T — inline styles on children
<Group gap={2}>
  <Button style={{ flex: 1 }}>Save</Button>
  <Button style={{ flex: 1 }}>Cancel</Button>
</Group>

// DO — evenly prop on parent
<Group evenly gap={2}>
  <Button>Save</Button>
  <Button>Cancel</Button>
</Group>
```

### Full-width row

Use `fullwidth` instead of `style={{ width: "100%" }}`.

```tsx
// DON'T
<Group style={{ width: "100%" }} gap={2}>...</Group>

// DO
<Group fullwidth gap={2}>...</Group>
```

### Vertically centered row

Use `ay="center"` instead of `style={{ alignItems: "center" }}`.

```tsx
// DON'T
<Group style={{ alignItems: "center" }} gap={2}>
  <Icon />
  <Text>Label</Text>
</Group>

// DO
<Group ay="center" gap={2}>
  <Icon />
  <Text>Label</Text>
</Group>
```

### Groups inside a Stack

When Groups are children of a `Stack ax="stretch"`, they automatically become full-width. This is preferable to setting `fullwidth` on each Group individually.

```tsx
// DON'T — redundant fullwidth on each Group
<Stack gap={4}>
  <Group fullwidth gap={2}>...</Group>
  <Group fullwidth gap={2}>...</Group>
</Stack>

// DO — stretch from the parent
<Stack ax="stretch" gap={4}>
  <Group gap={2}>...</Group>
  <Group gap={2}>...</Group>
</Stack>
```

## See Also

- [Stack](../stack/README.md) - Vertical layout component
- [Box](../box/README.md) - Underlying primitive with style props
- [Separator](../separator/README.md) - Divider for groups
