# Separator

> A visual divider for separating content. Built on [Base UI Separator](https://base-ui.com/react/components/separator).

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

| Prop          | Type                                                                             | Default        | Description            |
| ------------- | -------------------------------------------------------------------------------- | -------------- | ---------------------- |
| `orientation` | `"horizontal" \| "vertical"`                                                     | `"horizontal"` | Separator direction    |
| `shade`       | `"background" \| "surface" \| "accent" \| "halftone" \| "muted" \| "foreground"` | —              | Color shade variant    |
| `className`   | `string`                                                                         | —              | Additional CSS classes |

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
