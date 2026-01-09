# Box

> A polymorphic primitive component with style props for spacing, layout, and sizing. The foundation for Stack, Group, and Layer.

## Quick Reference

```tsx
import { Box } from "@uiid/layout";

// Basic usage
<Box p={4} gap={2}>
  <div>Child 1</div>
  <div>Child 2</div>
</Box>

// As different element
<Box render={<section />} p={4}>
  Section content
</Box>
```

## Examples

### Basic Box with Padding

```tsx
<Box p={4}>
  Padded content
</Box>
```

### Centered Content

```tsx
<Box ax="center" ay="center" fullheight>
  Centered in container
</Box>
```

### As Semantic Elements

```tsx
<Box render={<main />} p={4}>
  Main content
</Box>

<Box render={<article />} p={4}>
  Article content
</Box>

<Box render={<aside />} p={4}>
  Sidebar content
</Box>
```

### As Form

```tsx
<Box render={<form />} p={4} gap={3} direction="column">
  <input type="text" placeholder="Name" />
  <input type="email" placeholder="Email" />
  <button type="submit">Submit</button>
</Box>
```

### Full Width Container

```tsx
<Box fullwidth p={4}>
  Full width content
</Box>
```

### Full Height Layout

```tsx
<Box fullheight direction="column">
  <header>Header</header>
  <Box ay="stretch">Main</Box>
  <footer>Footer</footer>
</Box>
```

### Evenly Distributed Children

```tsx
<Box evenly fullwidth>
  <span>A</span>
  <span>B</span>
  <span>C</span>
</Box>
```

## Style Props

Box accepts style props that map to CSS properties using the design system's spacing scale.

### Spacing Scale

Numeric values (0-12) multiply against the spacing variable:

```tsx
// gap={4} → calc(4 * var(--spacing))
<Box gap={4}>...</Box>

// p={2} → calc(2 * var(--spacing)) padding
<Box p={2}>...</Box>
```

### Padding Shortcuts

```tsx
<Box p={4}>All sides</Box>
<Box px={4}>Horizontal</Box>
<Box py={4}>Vertical</Box>
<Box pt={4}>Top</Box>
<Box pr={4}>Right</Box>
<Box pb={4}>Bottom</Box>
<Box pl={4}>Left</Box>
```

### Margin Shortcuts

```tsx
<Box m={4}>All sides</Box>
<Box mx={4}>Horizontal</Box>
<Box my={4}>Vertical</Box>
<Box mt={4}>Top</Box>
<Box mr={4}>Right</Box>
<Box mb={4}>Bottom</Box>
<Box ml={4}>Left</Box>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `render` | `ReactElement` | `<div />` | Element to render as |
| `ax` | `"start" \| "center" \| "end" \| "stretch"` | — | Justify content |
| `ay` | `"start" \| "center" \| "end" \| "stretch"` | — | Align items |
| `direction` | `"row" \| "column"` | — | Flex direction |
| `gap` | `number` | — | Gap between children |
| `p` | `number` | — | Padding (all sides) |
| `px` | `number` | — | Padding horizontal |
| `py` | `number` | — | Padding vertical |
| `pt` / `pr` / `pb` / `pl` | `number` | — | Padding directional |
| `m` | `number` | — | Margin (all sides) |
| `mx` | `number` | — | Margin horizontal |
| `my` | `number` | — | Margin vertical |
| `mt` / `mr` / `mb` / `ml` | `number` | — | Margin directional |
| `fullwidth` | `boolean` | `false` | 100% width |
| `fullheight` | `boolean` | `false` | 100% height |
| `evenly` | `boolean` | `false` | Distribute children evenly |
| `className` | `string` | — | Additional CSS classes |
| `style` | `CSSProperties` | — | Inline styles |

## Data Slots

| Slot | Element |
|------|---------|
| `box` | Root box element |

## How Style Props Work

Style props are converted to data attributes and inline styles:

```tsx
<Box gap={4} p={2} fullwidth />
```

Renders as:

```html
<div
  data-slot="box"
  gap="4"
  p="2"
  fullwidth="true"
  style="gap: calc(4 * var(--spacing)); padding: calc(2 * var(--spacing));"
>
```

## See Also

- [Stack](../stack/README.md) - Vertical layout (uses Box)
- [Group](../group/README.md) - Horizontal layout (uses Box)
- [Layer](../layer/README.md) - Overlapping layers (uses Box)
