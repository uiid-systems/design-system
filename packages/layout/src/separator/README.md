# Separator

> A visual divider for separating content. Built on [Base UI Separator](https://base-ui.com/react/components/separator).

## Quick Reference

```tsx
import { Separator } from "@uiid/layout";

// Horizontal separator
<Separator />

// Vertical separator
<Separator orientation="vertical" />
```

## Examples

### Between Stack Items

```tsx
<Stack gap={2}>
  <p>Section 1</p>
  <Separator />
  <p>Section 2</p>
</Stack>
```

### Between Group Items

```tsx
<Group gap={2} ay="center">
  <button>Bold</button>
  <button>Italic</button>
  <Separator orientation="vertical" />
  <button>Align Left</button>
  <button>Align Right</button>
</Group>
```

### Menu Divider

```tsx
<Stack gap={0}>
  <MenuItem>Profile</MenuItem>
  <MenuItem>Settings</MenuItem>
  <Separator />
  <MenuItem>Logout</MenuItem>
</Stack>
```

### Toolbar Sections

```tsx
<Group gap={2}>
  <ToolbarButton>Cut</ToolbarButton>
  <ToolbarButton>Copy</ToolbarButton>
  <ToolbarButton>Paste</ToolbarButton>
  <Separator orientation="vertical" />
  <ToolbarButton>Undo</ToolbarButton>
  <ToolbarButton>Redo</ToolbarButton>
</Group>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Separator direction |
| `shade` | `string` | — | Color shade variant |
| `className` | `string` | — | Additional CSS classes |

## Data Attributes

| Attribute | Values |
|-----------|--------|
| `data-slot` | `"separator"` |
| `data-orientation` | `"horizontal" \| "vertical"` |

## Accessibility

- Has `role="separator"` for screen readers
- Uses `aria-orientation` for vertical separators
- Purely decorative, does not receive focus

## See Also

- [Stack](../stack/README.md) - Use horizontal separator between stack items
- [Group](../group/README.md) - Use vertical separator between group items
- [Base UI Separator](https://base-ui.com/react/components/separator) - Underlying primitive
