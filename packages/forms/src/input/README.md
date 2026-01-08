# Input

> Text input field with optional label and description. Built on [Base UI Input](https://base-ui.com/react/components/input).

## Quick Reference

```tsx
import { Input } from "@uiid/forms";

// Basic
<Input placeholder="Enter text..." />

// With label and description
<Input label="Email" description="We'll never share your email" />

// Variants
<Input size="small" />
<Input fullwidth />
<Input ghost />
```

## Examples

### Basic

```tsx
<Input placeholder="Enter your name" />
```

### With Label and Description

```tsx
<Input
  label="Email address"
  description="We'll never share your email with anyone."
  placeholder="you@example.com"
/>
```

### Required Field

```tsx
<Input label="Username" required />
```

### Sizes

```tsx
<Input size="small" placeholder="Small" />
<Input size="medium" placeholder="Medium" />
<Input size="large" placeholder="Large" />
```

### Full Width

```tsx
<Input fullwidth placeholder="Takes full container width" />
```

### Ghost Variant

```tsx
<Input ghost placeholder="No border until focused" />
```

### Disabled

```tsx
<Input disabled placeholder="Cannot edit" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | — | Label text displayed above input |
| `description` | `ReactNode` | — | Helper text displayed below input |
| `required` | `boolean` | `false` | Shows required indicator on label |
| `name` | `string` | — | Input name for form submission |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Controls input height and font size |
| `fullwidth` | `boolean` | `false` | Input takes full container width |
| `ghost` | `boolean` | `false` | Removes border until focused |
| `disabled` | `boolean` | `false` | Disables the input |
| `placeholder` | `string` | — | Placeholder text |
| `FieldProps` | `FieldProps` | — | Props forwarded to Field wrapper |
| `className` | `string` | — | Additional CSS classes |

> All other props are forwarded to the Base UI Input component.

## Data Slots

| Slot | Element |
|------|---------|
| `input` | The input element |
| `field-root` | Field wrapper (when label/description present) |
| `field-label` | Label element |
| `field-description` | Description element |

## Accessibility

- Built on Base UI Input which handles ARIA attributes
- Labels are automatically associated with inputs via Field
- Required fields display visual indicator and set `data-required`

## See Also

- [Field](../field/README.md) - Wrapper for form field labels and descriptions
- [NumberField](../number-field/README.md) - Numeric input with increment/decrement
- [Select](../select/README.md) - Dropdown selection
- [Base UI Input](https://base-ui.com/react/components/input) - Underlying primitive
