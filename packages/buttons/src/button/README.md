# Button

> Primary action button with multiple size, variant, and tone options

## Quick Reference

```tsx
import { Button } from "@uiid/buttons";

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="subtle" size="large" pill>
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
<Button variant="inverted">Inverted</Button>
<Button ghost>Ghost</Button>
```

### Sizes

```tsx
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
<Button pill>Rounded pill</Button>
<Button square>■</Button>
<Button circle>●</Button>
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

| Prop          | Type                                              | Default    | Description |
| ------------- | ------------------------------------------------- | ---------- | ----------- |
| `circle`      | `boolean`                                         | —          | —           |
| `disabled`    | `boolean`                                         | —          | —           |
| `fullwidth`   | `boolean`                                         | —          | —           |
| `ghost`       | `boolean`                                         | —          | —           |
| `interactive` | `boolean`                                         | `true`     | —           |
| `loading`     | `boolean`                                         | —          | —           |
| `pill`        | `boolean`                                         | —          | —           |
| `size`        | `"xsmall" \| "small" \| "medium" \| "large"`      | `"medium"` | —           |
| `square`      | `boolean`                                         | —          | —           |
| `tone`        | `"positive" \| "critical" \| "warning" \| "info"` | —          | —           |
| `tooltip`     | `ReactNode`                                       | —          | —           |
| `variant`     | `"subtle" \| "inverted"`                          | —          | —           |

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
