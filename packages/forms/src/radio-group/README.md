# RadioGroup

> A group of radio buttons for single-selection scenarios. Built on [Base UI RadioGroup](https://base-ui.com/react/components/radio-group).

## Quick Reference

```tsx
import { RadioGroup } from "@uiid/forms";

const items = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

// Basic (first item selected by default)
<RadioGroup items={items} />

// With specific default
<RadioGroup items={items} defaultValue="medium" />

// Variants
<RadioGroup items={items} direction="horizontal" />
<RadioGroup items={items} bordered />
```

## Examples

### Basic

```tsx
<RadioGroup items={items} />
```

### With Field Label

```tsx
<RadioGroup
  items={items}
  label="Select size"
  description="Choose the size that fits your needs"
/>
```

### Controlled

```tsx
const [value, setValue] = useState("small");

<RadioGroup
  items={items}
  value={value}
  onValueChange={setValue}
/>
```

### Default Value

First item is selected by default. Override with `defaultValue`:

```tsx
<RadioGroup items={items} defaultValue="medium" />
```

### Horizontal Layout

```tsx
<RadioGroup items={items} direction="horizontal" />
```

### Bordered

Card-style selection pattern:

```tsx
<RadioGroup items={items} bordered />
```

### Reversed

Places radios after labels:

```tsx
<RadioGroup items={items} reversed />
```

### Hidden Indicators

For card selections where border indicates selection:

```tsx
<RadioGroup items={items} bordered hideIndicators />
```

### Disabled

```tsx
<RadioGroup items={items} disabled />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `FormItemProps[]` | — | **Required.** Array of radio items |
| `label` | `ReactNode` | — | Field label for the group |
| `description` | `ReactNode` | — | Helper text below the group |
| `value` | `string` | — | Controlled selected value |
| `defaultValue` | `string` | First item | Initial selected value |
| `onValueChange` | `(value: string) => void` | — | Called when selection changes |
| `direction` | `"horizontal" \| "vertical"` | `"vertical"` | Layout direction |
| `bordered` | `boolean` | `false` | Bordered variant for all radios |
| `reversed` | `boolean` | `false` | Reversed layout for all radios |
| `hideIndicators` | `boolean` | `false` | Hides all radio indicators |
| `disabled` | `boolean` | `false` | Disables entire group |
| `RadioProps` | `Partial<RadioProps>` | — | Props forwarded to each Radio |
| `IndicatorProps` | `RadioIndicatorProps` | — | Props forwarded to each indicator |

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
| `radio` | Each radio element |

## Accessibility

- Built on Base UI RadioGroup which manages ARIA attributes
- Keyboard: Arrow keys to navigate options, Space to select

## See Also

- [Radio](../radio/README.md) - Individual radio component
- [CheckboxGroup](../checkbox-group/README.md) - Multiple selection from options
- [Base UI RadioGroup](https://base-ui.com/react/components/radio-group) - Underlying primitive
