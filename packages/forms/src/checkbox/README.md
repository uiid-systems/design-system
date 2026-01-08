# Checkbox

> A checkbox input with optional label and description. Built on [Base UI Checkbox](https://base-ui.com/react/components/checkbox).

## Quick Reference

```tsx
import { Checkbox } from "@uiid/forms";

// Basic
<Checkbox />

// With label
<Checkbox label="Accept terms" />

// Variants
<Checkbox bordered label="Bordered style" />
<Checkbox reversed label="Label on left" />
<Checkbox indeterminate label="Partial selection" />
```

## Examples

### Basic

```tsx
<Checkbox label="Subscribe to newsletter" />
```

### With Description

```tsx
<Checkbox
  label="Marketing emails"
  description="Receive updates about new features and promotions"
/>
```

### Controlled

```tsx
const [checked, setChecked] = useState(false);

<Checkbox
  label="I agree"
  checked={checked}
  onCheckedChange={setChecked}
/>
```

### Default Checked

```tsx
<Checkbox label="Enabled by default" defaultChecked />
```

### Indeterminate

Used for "select all" patterns when some items are selected:

```tsx
<Checkbox label="Select all" indeterminate />
```

### Bordered

Adds a border around the checkbox and label:

```tsx
<Checkbox bordered label="Bordered checkbox" />
```

### Reversed

Places the label before the checkbox:

```tsx
<Checkbox reversed label="Label on left" />
```

### Disabled

```tsx
<Checkbox disabled label="Cannot change" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | — | Label text |
| `description` | `ReactNode` | — | Helper text below label |
| `checked` | `boolean` | — | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Initial checked state (uncontrolled) |
| `onCheckedChange` | `(checked: boolean) => void` | — | Called when checked state changes |
| `indeterminate` | `boolean` | `false` | Shows indeterminate state |
| `bordered` | `boolean` | `false` | Adds border around checkbox and label |
| `reversed` | `boolean` | `false` | Places label before checkbox |
| `hideIndicator` | `boolean` | `false` | Hides the checkbox visually |
| `disabled` | `boolean` | `false` | Disables the checkbox |
| `ContainerProps` | `CheckboxFieldProps` | — | Props for the container element |
| `IndicatorProps` | `CheckboxIndicatorProps` | — | Props for the indicator element |

> All other props are forwarded to the Base UI Checkbox.Root component.

## Anatomy

```tsx
<CheckboxField>           {/* Container with label */}
  <CheckboxRoot>          {/* The checkbox control */}
    <CheckboxIndicator /> {/* Check mark icon */}
  </CheckboxRoot>
</CheckboxField>
```

## Subcomponents

| Component | Description |
|-----------|-------------|
| `CheckboxRoot` | The checkbox control element |
| `CheckboxField` | Container with label and description |
| `CheckboxIndicator` | The check mark icon |

## Data Slots

| Slot | Element |
|------|---------|
| `checkbox` | The checkbox root element |

## Accessibility

- Built on Base UI Checkbox which handles ARIA attributes
- Clicking label toggles checkbox
- Keyboard: Space to toggle when focused

## See Also

- [CheckboxGroup](../checkbox-group/README.md) - Multiple checkboxes with shared state
- [Radio](../radio/README.md) - Single selection from options
- [Switch](../switch/README.md) - Toggle for on/off states
- [Base UI Checkbox](https://base-ui.com/react/components/checkbox) - Underlying primitive
