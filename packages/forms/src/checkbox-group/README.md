# CheckboxGroup

> A group of checkboxes for multi-select scenarios. Built on [Base UI CheckboxGroup](https://base-ui.com/react/components/checkbox-group).

## Quick Reference

```tsx
import { CheckboxGroup } from "@uiid/forms";

const items = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
];

// Basic
<CheckboxGroup items={items} />

// With defaults
<CheckboxGroup items={items} defaultValue={["react"]} />

// Variants
<CheckboxGroup items={items} direction="horizontal" />
<CheckboxGroup items={items} bordered />
```

## Examples

### Basic

```tsx
<CheckboxGroup items={items} />
```

### With Field Label

```tsx
<CheckboxGroup
  items={items}
  label="Select frameworks"
  description="Choose all that apply"
/>
```

### Controlled

```tsx
const [value, setValue] = useState<string[]>([]);

<CheckboxGroup
  items={items}
  value={value}
  onValueChange={setValue}
/>
```

### Default Values

```tsx
<CheckboxGroup items={items} defaultValue={["react", "vue"]} />
```

### Horizontal Layout

```tsx
<CheckboxGroup items={items} direction="horizontal" />
```

### Bordered

Card-style selection pattern:

```tsx
<CheckboxGroup items={items} bordered />
```

### Reversed

Places checkboxes after labels:

```tsx
<CheckboxGroup items={items} reversed />
```

### Disabled

```tsx
<CheckboxGroup items={items} disabled />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `FormItemProps[]` | — | **Required.** Array of checkbox items |
| `label` | `ReactNode` | — | Field label for the group |
| `description` | `ReactNode` | — | Helper text below the group |
| `value` | `string[]` | — | Controlled selected values |
| `defaultValue` | `string[]` | — | Initial selected values |
| `onValueChange` | `(value: string[]) => void` | — | Called when selection changes |
| `direction` | `"horizontal" \| "vertical"` | `"vertical"` | Layout direction |
| `bordered` | `boolean` | `false` | Bordered variant for all checkboxes |
| `reversed` | `boolean` | `false` | Reversed layout for all checkboxes |
| `disabled` | `boolean` | `false` | Disables entire group |
| `hideIndicators` | `boolean` | `false` | Hides all checkbox indicators |
| `CheckboxProps` | `Partial<CheckboxProps>` | — | Props forwarded to each Checkbox |
| `IndicatorProps` | `CheckboxIndicatorProps` | — | Props forwarded to each indicator |

### FormItemProps

```ts
type FormItemProps = {
  value: string;
  label: string;
  disabled?: boolean;
};
```

## Data Slots

| Slot | Element |
|------|---------|
| `checkbox` | Each checkbox element |

## Accessibility

- Built on Base UI CheckboxGroup which manages ARIA attributes
- Keyboard: Tab to navigate between checkboxes, Space to toggle

## See Also

- [Checkbox](../checkbox/README.md) - Individual checkbox component
- [RadioGroup](../radio-group/README.md) - Single selection from options
- [Base UI CheckboxGroup](https://base-ui.com/react/components/checkbox-group) - Underlying primitive
