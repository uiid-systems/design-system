# Checkbox

A checkbox component built on [Base UI's Checkbox](https://base-ui.com/react/components/checkbox), with support for labels, descriptions, and visual variants.

## Usage

```tsx
import { Checkbox } from "@uiid/forms";

<Checkbox />;
```

### With Label

```tsx
<Checkbox label="Accept terms and conditions" />
```

### With Label and Description

```tsx
<Checkbox
  label="Marketing emails"
  description="Receive updates about new features and promotions."
/>
```

### Sizes

```tsx
<Checkbox size="sm" label="Small" />
<Checkbox size="md" label="Medium" />
<Checkbox size="lg" label="Large" />
```

### Bordered Variant

Wraps the checkbox in a bordered container, useful for card-style selections:

```tsx
<Checkbox bordered label="Option A" description="Description for option A" />
```

### Reversed Layout

Places the checkbox after the label:

```tsx
<Checkbox reversed label="Checkbox on the right" />
```

### Indeterminate State

For "select all" patterns where some children are checked:

```tsx
<Checkbox indeterminate label="Select all" />
```

### Controlled

```tsx
const [checked, setChecked] = useState(false);

<Checkbox checked={checked} onCheckedChange={setChecked} label="Controlled" />;
```

## Props

| Prop              | Type                         | Default | Description                          |
| ----------------- | ---------------------------- | ------- | ------------------------------------ |
| `checked`         | `boolean`                    | —       | Controlled checked state             |
| `defaultChecked`  | `boolean`                    | —       | Initial checked state (uncontrolled) |
| `onCheckedChange` | `(checked: boolean) => void` | —       | Callback when state changes          |
| `label`           | `ReactNode`                  | —       | Label text                           |
| `description`     | `ReactNode`                  | —       | Helper text below the label          |
| `size`            | `"sm" \| "md" \| "lg"`       | `"sm"`  | Size of the checkbox                 |
| `indeterminate`   | `boolean`                    | `false` | Shows indeterminate (minus) icon     |
| `bordered`        | `boolean`                    | `false` | Wraps in bordered container          |
| `reversed`        | `boolean`                    | `false` | Places checkbox after label          |
| `disabled`        | `boolean`                    | `false` | Disables the checkbox                |
| `ContainerProps`  | `GroupProps`                 | —       | Props for the container element      |
| `IndicatorProps`  | `CheckboxIndicatorProps`     | —       | Props for the indicator element      |

## Relationship to Radio

The Checkbox and Radio components share the same field layout system via `CheckboxField`. Both support:

- `label` and `description`
- `bordered` and `reversed` variants
- Similar visual styling

Use Checkbox for independent toggles. Use Radio within a RadioGroup for mutually exclusive options.

## Data Attributes

| Attribute        | Element   | Values                 | Description                 |
| ---------------- | --------- | ---------------------- | --------------------------- |
| `data-slot`      | root      | `"checkbox"`           | Identifies the root element |
| `data-slot`      | indicator | `"checkbox-indicator"` | Identifies the indicator    |
| `data-size`      | root      | `"sm" \| "md" \| "lg"` | Current size variant        |
| `data-checked`   | root      | Present when on        | Indicates checked state     |
| `data-unchecked` | root      | Present when off       | Indicates unchecked state   |
| `data-bordered`  | container | `true`                 | Bordered variant active     |
| `data-reversed`  | container | `"true"`               | Reversed layout active      |

## CSS Variables

| Variable                   | Description               |
| -------------------------- | ------------------------- |
| `--checkbox-size`          | Size of the checkbox      |
| `--checkbox-size-sm`       | Small size value          |
| `--checkbox-size-md`       | Medium size value         |
| `--checkbox-size-lg`       | Large size value          |
| `--checkbox-border-radius` | Border radius of checkbox |
| `--forms-background`       | Background color          |
| `--forms-backgroundHover`  | Background on hover       |
| `--forms-border-color`     | Border color              |

## File Structure

```
checkbox/
├── checkbox.tsx              # Component implementation
├── checkbox.types.ts         # TypeScript types
├── checkbox.constants.ts     # Default values
├── checkbox.module.css       # Styles
├── checkbox.test.tsx         # Unit tests
├── subcomponents/
│   ├── checkbox-root.tsx     # Root checkbox element
│   ├── checkbox-indicator.tsx# Check/minus icon
│   ├── checkbox-field.tsx    # Label/description wrapper
│   └── index.ts              # Subcomponent exports
└── README.md                 # This file
```
