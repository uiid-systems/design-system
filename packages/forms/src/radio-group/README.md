# RadioGroup

A group of radio buttons built on [Base UI's RadioGroup](https://base-ui.com/react/components/radio-group), for single-selection from multiple options.

## Usage

```tsx
import { RadioGroup } from "@uiid/forms";

const items = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

<RadioGroup items={items} />;
```

### Default Value

By default, the first item is selected. Override with `defaultValue`:

```tsx
<RadioGroup items={items} defaultValue="medium" />
```

### Controlled

```tsx
const [value, setValue] = useState("small");

<RadioGroup items={items} value={value} onValueChange={setValue} />;
```

### Horizontal Layout

```tsx
<RadioGroup items={items} direction="horizontal" />
```

### Bordered Variant

Card-style selection pattern:

```tsx
<RadioGroup items={items} bordered />
```

### Reversed Layout

Places radios after labels:

```tsx
<RadioGroup items={items} reversed />
```

### Hidden Indicator

For card selections where the border indicates selection:

```tsx
<RadioGroup items={items} bordered hideIndicator />
```

### Disabled Items

```tsx
const items = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B", disabled: true },
  { value: "c", label: "Option C" },
];

<RadioGroup items={items} />
```

## Props

| Prop            | Type                         | Default      | Description                          |
| --------------- | ---------------------------- | ------------ | ------------------------------------ |
| `items`         | `FormItemProps[]`            | —            | **Required.** Array of radio items   |
| `value`         | `string`                     | —            | Controlled selected value            |
| `defaultValue`  | `string`                     | First item   | Initial selected value               |
| `onValueChange` | `(value: string) => void`    | —            | Callback when selection changes      |
| `direction`     | `"horizontal" \| "vertical"` | `"vertical"` | Layout direction                     |
| `bordered`      | `boolean`                    | `false`      | Bordered variant for all radios      |
| `reversed`      | `boolean`                    | `false`      | Reversed layout for all radios       |
| `hideIndicator` | `boolean`                    | `false`      | Hides radio circles                  |
| `disabled`      | `boolean`                    | `false`      | Disables entire group                |
| `RadioProps`    | `Partial<RadioProps>`        | —            | Props passed to each Radio           |
| `IndicatorProps`| `RadioIndicatorProps`        | —            | Props passed to each indicator       |

### FormItemProps

```ts
type FormItemProps = {
  value: string;
  label: string;
  disabled?: boolean;
};
```

## Relationship to CheckboxGroup

RadioGroup and CheckboxGroup share a similar API design:

- Both accept an `items` array
- Both support `direction`, `bordered`, and `reversed`
- Both have props to customize child components

Use RadioGroup for single selection. Use CheckboxGroup for multiple selections.

## File Structure

```
radio-group/
├── radio-group.tsx       # Component implementation
├── radio-group.types.ts  # TypeScript types
├── radio-group.test.tsx  # Unit tests
└── README.md             # This file
```

