# Separator

> Visual divider line with horizontal or vertical orientation

## Quick Reference

```tsx
import { Separator } from "@uiid/layout";

// Horizontal separator (default)
<Separator />

// Vertical separator
<Separator orientation="vertical" />

// With shade variant
<Separator shade="accent" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gap` | `number` | — | — |
| `m` | `number \| "auto"` | — | — |
| `mb` | `number \| "auto"` | — | — |
| `ml` | `number \| "auto"` | — | — |
| `mr` | `number \| "auto"` | — | — |
| `mt` | `number \| "auto"` | — | — |
| `mx` | `number \| "auto"` | — | — |
| `my` | `number \| "auto"` | — | — |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | — |
| `p` | `number` | — | — |
| `pb` | `number` | — | — |
| `pl` | `number` | — | — |
| `pr` | `number` | — | — |
| `pt` | `number` | — | — |
| `px` | `number` | — | — |
| `py` | `number` | — | — |
| `shade` | `"background" \| "surface" \| "accent" \| "halftone" \| "muted" \| "foreground"` | — | — |

> Inherits all [Box](../box/README.md) props (spacing, sizing, render).

## Data Attributes

| Attribute          | Values                       |
| ------------------ | ---------------------------- |
| `data-slot`        | `"separator"`                |
| `data-orientation` | `"horizontal" \| "vertical"` |

## Accessibility

- Has `role="separator"` for screen readers
- Uses `aria-orientation` for vertical separators
- Purely decorative, does not receive focus

## See Also

- [Stack](../stack/README.md) - Use horizontal separator between stack items
- [Group](../group/README.md) - Use vertical separator between group items
- [Base UI Separator](https://base-ui.com/react/components/separator) - Underlying primitive
