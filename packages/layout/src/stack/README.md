# Stack

> A vertical layout component for stacking children from top to bottom with consistent spacing. Built on Box.

## Quick Reference

```tsx
import { Stack } from "@uiid/layout";

// Basic usage
<Stack gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>

// Centered content
<Stack ax="center" gap={4}>
  <h1>Title</h1>
  <p>Description</p>
</Stack>
```

## Examples

### Basic Stacking

```tsx
<Stack gap={4}>
  <header>Header</header>
  <main>Main content</main>
  <footer>Footer</footer>
</Stack>
```

### Centered Content

```tsx
<Stack ax="center" gap={2}>
  <h1>Welcome</h1>
  <p>Centered paragraph</p>
  <button>Get Started</button>
</Stack>
```

### Card Layout

```tsx
<Stack p={4} gap={2}>
  <h2>Card Title</h2>
  <p>Card description text goes here.</p>
  <span>Footer meta</span>
</Stack>
```

### Full Page Layout

```tsx
<Stack fullheight gap={0}>
  <header>Navigation</header>
  <Stack render={<main />} ay="stretch" p={4}>
    Page content
  </Stack>
  <footer>Footer</footer>
</Stack>
```

### Form Layout

```tsx
<Stack gap={3}>
  <Stack gap={1}>
    <label>Email</label>
    <input type="email" />
  </Stack>
  <Stack gap={1}>
    <label>Password</label>
    <input type="password" />
  </Stack>
  <button type="submit">Sign In</button>
</Stack>
```

### Navigation List

```tsx
<Stack render={<nav />} gap={2}>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</Stack>
```

### As Unordered List

```tsx
<Stack render={<ul />} gap={1}>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</Stack>
```

## Alignment in Stack Context

Stack swaps `ax` and `ay` to be intuitive in a vertical context:
- `ax` controls **horizontal** alignment (cross-axis in a column)
- `ay` controls **vertical** distribution (main-axis in a column)

```tsx
// Center items horizontally
<Stack ax="center">
  <div>Centered</div>
</Stack>

// Push items to the end vertically
<Stack ay="end">
  <div>At bottom</div>
</Stack>

// Both centered
<Stack ax="center" ay="center" fullheight>
  <div>Centered in viewport</div>
</Stack>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gap` | `number` | — | Space between children (uses spacing scale) |
| `ax` | `"start" \| "center" \| "end" \| "stretch"` | — | Horizontal alignment |
| `ay` | `"start" \| "center" \| "end" \| "stretch"` | — | Vertical distribution |
| `p` | `number` | — | Padding on all sides |
| `px` | `number` | — | Horizontal padding |
| `py` | `number` | — | Vertical padding |
| `pt` | `number` | — | Padding top |
| `pr` | `number` | — | Padding right |
| `pb` | `number` | — | Padding bottom |
| `pl` | `number` | — | Padding left |
| `m` | `number` | — | Margin on all sides |
| `mx` | `number` | — | Horizontal margin |
| `my` | `number` | — | Vertical margin |
| `mt` | `number` | — | Margin top |
| `mr` | `number` | — | Margin right |
| `mb` | `number` | — | Margin bottom |
| `ml` | `number` | — | Margin left |
| `fullwidth` | `boolean` | `false` | Stretch to fill container width |
| `fullheight` | `boolean` | `false` | Stretch to fill container height |
| `render` | `ReactElement` | `<div />` | Custom element to render as |
| `className` | `string` | — | Additional CSS classes |

## Data Slots

| Slot | Element |
|------|---------|
| `stack` | Root stack element |

## Common Patterns

### Page Layout

```tsx
<Stack fullheight>
  <header>Nav</header>
  <Stack render={<main />} ay="stretch">
    Content
  </Stack>
  <footer>Footer</footer>
</Stack>
```

### Modal Content

```tsx
<Stack gap={4} p={4}>
  <h2>Modal Title</h2>
  <p>Modal content goes here.</p>
  <Group ax="end" gap={2}>
    <button>Cancel</button>
    <button>Confirm</button>
  </Group>
</Stack>
```

### Settings List

```tsx
<Stack gap={0}>
  <SettingsRow>General</SettingsRow>
  <Separator />
  <SettingsRow>Privacy</SettingsRow>
  <Separator />
  <SettingsRow>Notifications</SettingsRow>
</Stack>
```

## See Also

- [Group](../group/README.md) - Horizontal layout component
- [Box](../box/README.md) - Underlying primitive with style props
- [Layer](../layer/README.md) - Overlapping layers
