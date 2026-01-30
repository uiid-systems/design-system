# Textarea

> Multi-line text input with label and description support

## Quick Reference

```tsx
import { Textarea } from "@uiid/forms";

// Basic
<Textarea placeholder="Enter your message..." />

// With label and description
<Textarea label="Comments" description="Share your thoughts" />

// Variants
<Textarea size="small" />
<Textarea rows={5} />
<Textarea resize="none" />
<Textarea fullwidth />
<Textarea ghost />
```

## Examples

### Basic

```tsx
<Textarea placeholder="Write your message here..." />
```

### With Label and Description

```tsx
<Textarea
  label="Feedback"
  description="Please provide detailed feedback about your experience."
  placeholder="Enter your feedback..."
/>
```

### Required Field

```tsx
<Textarea label="Comments" required />
```

### Custom Rows

```tsx
<Textarea rows={2} placeholder="Short textarea" />
<Textarea rows={5} placeholder="Taller textarea" />
<Textarea rows={10} placeholder="Very tall textarea" />
```

### Resize Options

```tsx
<Textarea resize="none" placeholder="Cannot be resized" />
<Textarea resize="vertical" placeholder="Resize vertically only (default)" />
<Textarea resize="horizontal" placeholder="Resize horizontally only" />
<Textarea resize="both" placeholder="Resize in any direction" />
```

### Sizes

```tsx
<Textarea size="small" placeholder="Small" />
<Textarea size="medium" placeholder="Medium" />
<Textarea size="large" placeholder="Large" />
```

### Full Width

```tsx
<Textarea fullwidth placeholder="Takes full container width" />
```

### Ghost Variant

```tsx
<Textarea ghost placeholder="No border until focused" />
```

### Disabled

```tsx
<Textarea disabled placeholder="Cannot edit" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | — | — |
| `description` | `string` | — | — |
| `disabled` | `boolean` | — | — |
| `fullwidth` | `boolean` | — | — |
| `ghost` | `boolean` | — | — |
| `label` | `string` | — | — |
| `placeholder` | `string` | — | — |
| `required` | `boolean` | — | — |
| `resize` | `"none" \| "vertical" \| "horizontal" \| "both"` | `"vertical"` | — |
| `rows` | `number` | `3` | — |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | — |
| `value` | `string` | — | — |

> All other props are forwarded to the native textarea element.

## Data Slots

| Slot | Element |
|------|---------|
| `textarea` | The textarea element |
| `field-root` | Field wrapper (when label/description present) |
| `field-label` | Label element |
| `field-description` | Description element |

## Accessibility

- Labels are automatically associated with textareas via Base UI Field.Control
- Required fields display visual indicator and set `data-required`
- Uses native textarea semantics for full screen reader support

## See Also

- [Field](../field/README.md) - Wrapper for form field labels and descriptions
- [Input](../input/README.md) - Single-line text input
- [Base UI Field](https://base-ui.com/react/components/field) - Field wrapper primitive
