# Field

> A wrapper that adds labels, descriptions, and error messages to form controls. Built on [Base UI Field](https://base-ui.com/react/components/field).

## Quick Reference

```tsx
import { Field } from "@uiid/forms";
import { Input } from "@uiid/forms";

// Basic with input
<Field label="Email">
  <Input placeholder="you@example.com" />
</Field>

// With description
<Field label="Email" description="We'll never share your email">
  <Input placeholder="you@example.com" />
</Field>

// Required
<Field label="Email" required>
  <Input placeholder="you@example.com" />
</Field>
```

## Examples

### Basic

```tsx
<Field label="Username">
  <Input placeholder="Enter username" />
</Field>
```

### With Description

```tsx
<Field
  label="Email address"
  description="We'll never share your email with anyone."
>
  <Input placeholder="you@example.com" />
</Field>
```

### Required Field

```tsx
<Field label="Password" required>
  <Input type="password" />
</Field>
```

### With Any Form Control

Field works with any form control:

```tsx
<Field label="Framework" description="Choose your preferred framework">
  <Select items={items} />
</Field>

<Field label="Quantity">
  <NumberField min={1} max={10} />
</Field>

<Field label="Volume">
  <Slider />
</Field>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label text displayed above the control |
| `description` | `string` | — | Helper text displayed below the control |
| `name` | `string` | — | Field name for form submission |
| `required` | `boolean` | `false` | Shows required indicator on label |
| `children` | `ReactNode` | — | The form control to wrap |
| `RootProps` | `FieldRootProps` | — | Props for the root element |
| `LabelProps` | `FieldLabelProps` | — | Props for the label element |
| `DescriptionProps` | `FieldDescriptionProps` | — | Props for the description element |
| `ErrorProps` | `FieldErrorProps` | — | Props for the error element |

## Anatomy

```tsx
<FieldRoot>              {/* Container */}
  <FieldLabel />         {/* Label text */}
  {children}             {/* Form control */}
  <FieldError />         {/* Error message */}
  <FieldDescription />   {/* Helper text */}
</FieldRoot>
```

## Subcomponents

| Component | Description |
|-----------|-------------|
| `FieldRoot` | Root container element |
| `FieldLabel` | Label element with required indicator |
| `FieldDescription` | Helper text element |
| `FieldError` | Error message element |

## Data Slots

| Slot | Element |
|------|---------|
| `field-root` | The root container |
| `field-label` | The label element |
| `field-description` | The description element |
| `field-error` | The error element |

## When to Use Field

Many form components have built-in `label` and `description` props. Use Field when:

- You need more control over the label/description layout
- You're using a component without built-in label support
- You want consistent styling across different form controls

## Accessibility

- Built on Base UI Field which handles ARIA attributes
- Labels are automatically associated with form controls
- Required fields show visual indicator and set `data-required`
- Error messages are linked via `aria-describedby`

## See Also

- [Form](../form/README.md) - Form container with validation
- [Input](../input/README.md) - Text input with built-in label support
- [Base UI Field](https://base-ui.com/react/components/field) - Underlying primitive
