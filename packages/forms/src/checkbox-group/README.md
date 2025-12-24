# CheckboxGroup

A group of checkboxes built on [Base UI's CheckboxGroup](https://base-ui.com/react/components/checkbox-group), for managing multiple checkbox selections.

## Usage

```tsx
import { CheckboxGroup } from "@uiid/forms";

const items = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
];

<CheckboxGroup items={items} />;
```

### Default Values

```tsx
<CheckboxGroup items={items} defaultValue={["react", "vue"]} />
```

### Controlled

```tsx
const [value, setValue] = useState<string[]>(["react"]);

<CheckboxGroup items={items} value={value} onValueChange={setValue} />;
```

### Horizontal Layout

```tsx
<CheckboxGroup items={items} direction="horizontal" />
```

### Bordered Variant

Card-style selection pattern:

```tsx
<CheckboxGroup items={items} bordered />
```

### Reversed Layout

Places checkboxes after labels:

```tsx
<CheckboxGroup items={items} reversed />
```

### Disabled Items

```tsx
const items = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B", disabled: true },
  { value: "c", label: "Option C" },
];

<CheckboxGroup items={items} />;
```

## Props

| Prop             | Type                         | Default      | Description                           |
| ---------------- | ---------------------------- | ------------ | ------------------------------------- |
| `items`          | `FormItemProps[]`            | —            | **Required.** Array of checkbox items |
| `value`          | `string[]`                   | —            | Controlled selected values            |
| `defaultValue`   | `string[]`                   | —            | Initial selected values               |
| `onValueChange`  | `(value: string[]) => void`  | —            | Callback when selection changes       |
| `direction`      | `"horizontal" \| "vertical"` | `"vertical"` | Layout direction                      |
| `bordered`       | `boolean`                    | `false`      | Bordered variant for all checkboxes   |
| `reversed`       | `boolean`                    | `false`      | Reversed layout for all checkboxes    |
| `disabled`       | `boolean`                    | `false`      | Disables entire group                 |
| `CheckboxProps`  | `Partial<CheckboxProps>`     | —            | Props passed to each Checkbox         |
| `IndicatorProps` | `CheckboxIndicatorProps`     | —            | Props passed to each indicator        |

### FormItemProps

```ts
type FormItemProps = {
  value: string;
  label: string;
  disabled?: boolean;
};
```

## Relationship to RadioGroup

CheckboxGroup and RadioGroup share a similar API design:

- Both accept an `items` array
- Both support `direction`, `bordered`, and `reversed`
- Both have props to customize child components

Use CheckboxGroup for multiple selections. Use RadioGroup for single selection.

## File Structure

```
checkbox-group/
├── checkbox-group.tsx       # Component implementation
├── checkbox-group.types.ts  # TypeScript types
├── checkbox-group.test.tsx  # Unit tests
└── README.md                # This file
```
