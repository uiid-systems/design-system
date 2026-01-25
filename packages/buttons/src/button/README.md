# Button

> A clickable button component with multiple variants, sizes, and states. Built on [Base UI Button](https://base-ui.com/react/components/button).

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

| Prop        | Type                                              | Default    | Description                             |
| ----------- | ------------------------------------------------- | ---------- | --------------------------------------- |
| `variant`   | `"subtle" \| "inverted"`                          | —          | Visual variant                          |
| `size`      | `"small" \| "medium" \| "large"`                  | `"medium"` | Button size                             |
| `tone`      | `"positive" \| "critical" \| "warning" \| "info"` | —          | Semantic color                          |
| `ghost`     | `boolean`                                         | `false`    | Transparent background                  |
| `pill`      | `boolean`                                         | `false`    | Fully rounded corners                   |
| `square`    | `boolean`                                         | `false`    | Equal width and height                  |
| `circle`    | `boolean`                                         | `false`    | Circular shape (combines pill + square) |
| `grows`     | `boolean`                                         | `true`     | Allow button to grow                    |
| `loading`   | `boolean`                                         | `false`    | Show loading spinner                    |
| `tooltip`   | `ReactNode`                                       | —          | Tooltip content on hover                |
| `disabled`  | `boolean`                                         | `false`    | Disable interactions                    |
| `className` | `string`                                          | —          | Additional CSS classes                  |

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
