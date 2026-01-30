# Text

> Typography component with size scale, weight, color shades, and text decorations

## Quick Reference

```tsx
import { Text } from "@uiid/typography";

// Size and weight
<Text size={2} weight="bold">Heading</Text>

// Shade and tone
<Text shade="muted">Secondary text</Text>
<Text tone="critical">Error message</Text>

// Spacing properties
<Text p={1} px={1} py={1} pl={1} pr={1} pt={1} pb={1} />
<Text m={1} mx={1} my={1} ml={1} mr={1} mt={1} mb={1} />

// Render a custom element
<Text render={<h1 />}>Page Title</Text>
<Text render={<label htmlFor="email" />}>Email</Text>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `"left" \| "center" \| "right" \| "justify"` | — | — |
| `balance` | `boolean` | — | — |
| `gap` | `number` | — | — |
| `m` | `number \| "auto"` | — | — |
| `mb` | `number \| "auto"` | — | — |
| `ml` | `number \| "auto"` | — | — |
| `mono` | `boolean` | — | — |
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
| `shade` | `"background" \| "surface" \| "accent" \| "halftone" \| "muted" \| "foreground"` | — | — |
| `size` | `-1 \| 0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8` | — | — |
| `strikethrough` | `boolean` | — | — |
| `tone` | `"positive" \| "critical" \| "warning" \| "info"` | — | — |
| `underline` | `boolean` | — | — |
| `weight` | `"thin" \| "light" \| "normal" \| "bold"` | — | — |

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

## Size Guide

| Size     | Use for                     |
| -------- | --------------------------- |
| `-1`, `0` | Captions, small labels      |
| `1`, `2`  | Body text                   |
| `3`, `4`  | Subheadings                 |
| `5`, `6`  | Section headings            |
| `7`, `8`  | Page titles, large display  |

## Common Patterns

### Use Text props instead of CSS for text styling

```tsx
// DON'T — inline styles or CSS classes for text appearance
<span style={{ fontSize: "14px", color: "gray", fontWeight: "bold" }}>
  Label
</span>

// DO — Text with variant props
<Text size={0} shade="muted" weight="bold">Label</Text>
```

### Use spacing props instead of wrapper elements

```tsx
// DON'T — wrapper div for margin
<div style={{ marginBottom: "16px" }}>
  <Text size={4}>Section Title</Text>
</div>

// DO — spacing prop directly on Text
<Text size={4} mb={4}>Section Title</Text>
```

### Use render prop for semantic HTML

```tsx
// DON'T — raw HTML elements with className
<h2 className={styles.heading}>Page Title</h2>

// DO — Text with render for semantics, props for styling
<Text render={<h2 />} size={5} weight="bold">Page Title</Text>
```

## Data Slots

| Slot   | Element           |
| ------ | ----------------- |
| `text` | Root text element |

## See Also

- [Stack](../../../layout/src/stack/README.md) - Vertical layout component
- [Group](../../../layout/src/group/README.md) - Horizontal layout component
