# Separator

> Visual divider line with horizontal or vertical orientation, with optional text or content

## Quick Reference

```tsx
import { Separator } from "@uiid/layout";

// Horizontal separator (default)
<Separator />

// Vertical separator
<Separator orientation="vertical" />

// With shade variant
<Separator shade="accent" />

// With text content
<Separator>
  <Text size={0} shade="muted">or continue with email</Text>
</Separator>

// Vertical with content
<Separator orientation="vertical">
  <Text size={0} shade="muted">or</Text>
</Separator>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | — | Optional content rendered centered between two lines |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Separator direction |
| `shade` | `"background" \| "surface" \| "accent" \| "halftone" \| "muted" \| "foreground"` | — | Line color shade |
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

> Inherits all [Box](../box/README.md) props (spacing, sizing, render).

## With Children

When `children` are provided, the separator renders two line segments flanking the content. Layout is composed from `Group` (horizontal) or `Stack` (vertical) via `SwitchRender`. Children can be any React node — text, badges, icons, etc.

```tsx
// Common "or" divider pattern
<Separator>
  <Text size={0} shade="muted">or continue with email</Text>
</Separator>

// Works with any content
<Separator>
  <Badge>NEW</Badge>
</Separator>
```

Without children, the separator renders as a simple line using the Base UI `Separator` primitive.

## Data Attributes

| Attribute          | Values                       |
| ------------------ | ---------------------------- |
| `data-slot`        | `"separator"`                |
| `data-orientation` | `"horizontal" \| "vertical"` |

## Accessibility

- Has `role="separator"` for screen readers
- Uses `aria-orientation` for vertical separators
- When children are present, the separator role is preserved on the container

## See Also

- [Stack](../stack/README.md) - Use horizontal separator between stack items
- [Group](../group/README.md) - Use vertical separator between group items
- [Base UI Separator](https://base-ui.com/react/components/separator) - Underlying primitive
