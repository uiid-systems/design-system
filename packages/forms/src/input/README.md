# Input

A text input component built on [Base UI's Input](https://base-ui.com/react/components/input), wrapped with optional `Field` support for labels, descriptions, and error messages.

## Usage

```tsx
import { Input } from "@uiid/forms";

<Input placeholder="Enter your email" />;
```

### With Label and Description

```tsx
<Input
  label="Email address"
  description="We'll never share your email with anyone."
  placeholder="you@example.com"
/>
```

### Sizes

The `size` prop controls the font size of the input. Defaults to `"medium"`.

```tsx
<Input size="small" placeholder="Small" />
<Input size="medium" placeholder="Medium" />
<Input size="large" placeholder="Large" />
```

### Disabled State

```tsx
<Input disabled placeholder="Disabled input" />
```

### With Error

```tsx
<Input label="Email" error="This field is required" required />
```

### Grouping Inputs

Use the `Field` component to wrap multiple inputs with a shared label:

```tsx
import { Input, Field } from "@uiid/forms";
import { Group } from "@uiid/layout";

<Field label="Full name" description="Enter your first and last name">
  <Group fullwidth evenly gap={2}>
    <Input placeholder="First name" />
    <Input placeholder="Last name" />
  </Group>
</Field>;
```

## Props

| Prop          | Type                             | Default    | Description                                 |
| ------------- | -------------------------------- | ---------- | ------------------------------------------- |
| `size`        | `"small" \| "medium" \| "large"` | `"medium"` | Controls the font size of the input         |
| `label`       | `ReactNode`                      | —          | Label text displayed above the input        |
| `description` | `ReactNode`                      | —          | Helper text displayed below the input       |
| `error`       | `ReactNode`                      | —          | Error message (shown when validation fails) |
| `className`   | `string`                         | —          | Additional CSS class names                  |
| `disabled`    | `boolean`                        | `false`    | Disables the input                          |
| `required`    | `boolean`                        | `false`    | Marks the input as required                 |
| `placeholder` | `string`                         | —          | Placeholder text                            |

All other props are forwarded to the underlying Base UI `Input` component.

## Data Attributes

| Attribute   | Values                           | Description                  |
| ----------- | -------------------------------- | ---------------------------- |
| `data-slot` | `"input"`                        | Identifies the input element |
| `data-size` | `"small" \| "medium" \| "large"` | Current size variant         |

## CSS Variables

The input uses design tokens from the forms and globals layers:

| Variable                       | Description                  |
| ------------------------------ | ---------------------------- |
| `--forms-background`           | Default background color     |
| `--forms-backgroundHover`      | Background color on hover    |
| `--forms-backgroundFocus`      | Background color on focus    |
| `--forms-border-color`         | Border color                 |
| `--forms-padding-x`            | Horizontal padding           |
| `--forms-padding-y`            | Vertical padding             |
| `--forms-fontSize`             | Base font size               |
| `--forms-size-small-fontSize`  | Font size for small variant  |
| `--forms-size-medium-fontSize` | Font size for medium variant |
| `--forms-size-large-fontSize`  | Font size for large variant  |

## File Structure

```
input/
├── input.tsx           # Component implementation
├── input.types.ts      # TypeScript types
├── input.module.css    # Styles
├── input.stories.tsx   # Storybook stories
├── input.test.tsx      # Unit tests
├── input.variants.ts   # Style variants
└── README.md           # This file
```
