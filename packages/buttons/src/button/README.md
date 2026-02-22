# Button

> Primary action button with multiple size, variant, and tone options

## Quick Reference

```tsx
import { Button } from "@uiid/buttons";

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="subtle" size="large" shape="pill">
  Submit
</Button>
```

## Examples

### Basic

```tsx
<Button>Default button</Button>
<Button disabled>Disabled</Button>
```

### Variants

```tsx
<Button variant="subtle">Subtle</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="inverted">Inverted</Button>
```

### Sizes

```tsx
<Button size="xsmall">Extra Small</Button>
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>
```

### Tones

```tsx
<Button tone="positive">Success</Button>
<Button tone="critical">Danger</Button>
<Button tone="warning">Warning</Button>
<Button tone="info">Info</Button>
```

### Shapes

```tsx
<Button shape="pill">Rounded pill</Button>
<Button shape="square">■</Button>
<Button shape="circle">●</Button>
```

### Loading State

```tsx
<Button loading>Submitting...</Button>
```

### As Link

```tsx
<Button nativeButton={false} render={<a href="/page" />}>
  Navigate
</Button>
```

## Props

| Prop        | Type                                              | Default    | Description                           |
| ----------- | ------------------------------------------------- | ---------- | ------------------------------------- |
| `variant`   | `"subtle" \| "ghost" \| "inverted"`               | —          | Visual style variant                  |
| `shape`     | `"pill" \| "square" \| "circle"`                  | —          | Button shape                          |
| `size`      | `"xsmall" \| "small" \| "medium" \| "large"`      | `"medium"` | Size variant                          |
| `tone`      | `"positive" \| "critical" \| "warning" \| "info"` | —          | Semantic color tone                   |
| `fullwidth` | `boolean`                                         | —          | Expand to fill container width        |
| `loading`   | `boolean`                                         | —          | Show loading spinner, hide content    |
| `disabled`  | `boolean`                                         | —          | Disable the button                    |
| `tooltip`   | `ReactNode`                                       | —          | Tooltip content                       |

> Additional props are forwarded to the underlying Base UI Button.

## Data Slots

| Slot                       | Element             |
| -------------------------- | ------------------- |
| `button`                   | Root button element |
| `button-content-container` | Content wrapper     |
| `button-spinner`           | Loading spinner     |

## Accessibility

- Built on Base UI Button with proper ARIA attributes
- Keyboard: `Enter` and `Space` trigger click
- Supports `aria-label` for icon-only buttons
- `disabled` state is properly announced

## See Also

- [ToggleButton](../toggle-button/README.md) - Button with toggle state
- [Base UI Button](https://base-ui.com/react/components/button) - Underlying primitive
