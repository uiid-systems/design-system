# NumberField

> A numeric input with increment/decrement buttons. Built on [Base UI NumberField](https://base-ui.com/react/components/number-field).

## Quick Reference

```tsx
import { NumberField } from "@uiid/forms";

// Basic
<NumberField />

// With constraints
<NumberField min={0} max={100} defaultValue={50} />

// With step
<NumberField step={5} defaultValue={0} />
```

## Examples

### Basic

```tsx
<NumberField />
```

### Default Value

```tsx
<NumberField defaultValue={50} />
```

### Min and Max

```tsx
<NumberField min={0} max={100} defaultValue={50} />
```

### Step

```tsx
<NumberField step={5} defaultValue={0} />
```

### Controlled

```tsx
const [value, setValue] = useState<number | null>(100);

<NumberField value={value} onValueChange={setValue} />
```

### With Format Options

Format the displayed value using `Intl.NumberFormat` options:

```tsx
<NumberField
  defaultValue={1000}
  formatOptions={{
    style: "currency",
    currency: "USD",
  }}
/>
```

### Disabled

```tsx
<NumberField disabled defaultValue={50} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number \| null` | — | Controlled value |
| `defaultValue` | `number` | `100` | Initial value |
| `onValueChange` | `(value: number \| null) => void` | — | Called when value changes |
| `min` | `number` | — | Minimum allowed value |
| `max` | `number` | — | Maximum allowed value |
| `step` | `number` | `1` | Increment/decrement step |
| `smallStep` | `number` | — | Step when holding Shift |
| `largeStep` | `number` | — | Step when holding Ctrl/Cmd |
| `disabled` | `boolean` | `false` | Disables the field |
| `readOnly` | `boolean` | `false` | Makes the input read-only |
| `formatOptions` | `Intl.NumberFormatOptions` | — | Number formatting options |
| `DecrementProps` | `NumberFieldDecrementProps` | — | Props for decrement button |
| `IncrementProps` | `NumberFieldIncrementProps` | — | Props for increment button |
| `InputProps` | `NumberFieldInputProps` | — | Props for the input element |

## Anatomy

```tsx
<NumberFieldRoot>              {/* Provider */}
  <NumberFieldDecrement />     {/* Minus button */}
  <NumberFieldInput />         {/* Numeric input */}
  <NumberFieldIncrement />     {/* Plus button */}
</NumberFieldRoot>
```

## Subcomponents

| Component | Description |
|-----------|-------------|
| `NumberFieldRoot` | Root container component |
| `NumberFieldDecrement` | Decrement button |
| `NumberFieldInput` | The numeric input |
| `NumberFieldIncrement` | Increment button |

## Data Slots

| Slot | Element |
|------|---------|
| `number-field-decrement` | The decrement button |
| `number-field-increment` | The increment button |

## Keyboard

| Key | Action |
|-----|--------|
| `↑` | Increment by step |
| `↓` | Decrement by step |
| `Shift+↑` | Increment by smallStep |
| `Shift+↓` | Decrement by smallStep |
| `Ctrl+↑` | Increment by largeStep |
| `Ctrl+↓` | Decrement by largeStep |
| `Home` | Set to min (if defined) |
| `End` | Set to max (if defined) |

## Accessibility

- Built on Base UI NumberField which handles ARIA attributes
- Keyboard navigation for increment/decrement
- Input accepts only numeric values

## See Also

- [Input](../input/README.md) - Basic text input
- [Base UI NumberField](https://base-ui.com/react/components/number-field) - Underlying primitive
