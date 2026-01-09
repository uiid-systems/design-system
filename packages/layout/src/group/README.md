# Group

> A horizontal layout component for arranging children side by side with consistent spacing. Built on Box.

## Quick Reference

```tsx
import { Group } from "@uiid/layout";

// Basic usage
<Group gap={2}>
  <button>Cancel</button>
  <button>Save</button>
</Group>

// Vertically centered
<Group ay="center" gap={2}>
  <Avatar />
  <span>Username</span>
</Group>
```

## Examples

### Button Group

```tsx
<Group gap={2}>
  <button>Cancel</button>
  <button>Save</button>
  <button>Delete</button>
</Group>
```

### Icon and Text

```tsx
<Group gap={1} ay="center">
  <Icon name="bell" />
  <span>Notifications</span>
</Group>
```

### Header Layout

```tsx
<Group render={<header />} ax="stretch" ay="center" p={4}>
  <span>Logo</span>
  <nav>Navigation</nav>
</Group>
```

### Toolbar

```tsx
<Group gap={1}>
  <button>Bold</button>
  <button>Italic</button>
  <button>Underline</button>
  <Separator orientation="vertical" />
  <button>Align Left</button>
  <button>Align Center</button>
  <button>Align Right</button>
</Group>
```

### Navigation

```tsx
<Group render={<nav />} gap={4}>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/products">Products</a>
  <a href="/contact">Contact</a>
</Group>
```

### User Info

```tsx
<Group gap={2} ay="center">
  <img src={avatar} alt="" style={{ width: 32, height: 32, borderRadius: "50%" }} />
  <Stack gap={0}>
    <span>Jane Doe</span>
    <span>@janedoe</span>
  </Stack>
</Group>
```

### Form Row

```tsx
<Group gap={2} ay="end">
  <Stack gap={1}>
    <label>First Name</label>
    <input type="text" />
  </Stack>
  <Stack gap={1}>
    <label>Last Name</label>
    <input type="text" />
  </Stack>
</Group>
```

### Tag List

```tsx
<Group gap={1}>
  <span className="tag">React</span>
  <span className="tag">TypeScript</span>
  <span className="tag">CSS</span>
</Group>
```

### Split Layout (Space Between)

```tsx
<Group ax="stretch" ay="center" fullwidth>
  <span>Left content</span>
  <span>Right content</span>
</Group>
```

### Evenly Distributed

```tsx
<Group evenly fullwidth>
  <button>Option A</button>
  <button>Option B</button>
  <button>Option C</button>
</Group>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gap` | `number` | — | Space between children (uses spacing scale) |
| `ax` | `"start" \| "center" \| "end" \| "stretch"` | — | Horizontal distribution |
| `ay` | `"start" \| "center" \| "end" \| "stretch"` | — | Vertical alignment |
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
| `evenly` | `boolean` | `false` | Distribute children evenly |
| `render` | `ReactElement` | `<div />` | Custom element to render as |
| `className` | `string` | — | Additional CSS classes |

## Data Slots

| Slot | Element |
|------|---------|
| `group` | Root group element |

## Common Patterns

### Action Buttons

```tsx
<Group gap={2} ax="end">
  <button>Cancel</button>
  <button>Submit</button>
</Group>
```

### Breadcrumbs

```tsx
<Group gap={2} ay="center">
  <a href="/">Home</a>
  <span>/</span>
  <a href="/products">Products</a>
  <span>/</span>
  <span>Current Page</span>
</Group>
```

### Inline Form

```tsx
<Group gap={2} ay="end">
  <input type="email" placeholder="Enter email" />
  <button type="submit">Subscribe</button>
</Group>
```

### Card Header

```tsx
<Group ax="stretch" ay="center">
  <h3>Card Title</h3>
  <button>...</button>
</Group>
```

## See Also

- [Stack](../stack/README.md) - Vertical layout component
- [Box](../box/README.md) - Underlying primitive with style props
- [Separator](../separator/README.md) - Divider for groups
