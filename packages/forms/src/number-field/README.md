# NumberField

A numeric input component built on [Base UI's NumberField](https://base-ui.com/react/components/number-field), with increment/decrement buttons.

## Usage

```tsx
import { NumberField } from "@uiid/forms";

<NumberField />;
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

<NumberField value={value} onValueChange={setValue} />;
```

### Disabled

```tsx
<NumberField disabled defaultValue={50} />
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

## Props

| Prop             | Type                              | Default | Description                 |
| ---------------- | --------------------------------- | ------- | --------------------------- |
| `value`          | `number \| null`                  | —       | Controlled value            |
| `defaultValue`   | `number`                          | `100`   | Initial value               |
| `onValueChange`  | `(value: number \| null) => void` | —       | Callback when value changes |
| `min`            | `number`                          | —       | Minimum allowed value       |
| `max`            | `number`                          | —       | Maximum allowed value       |
| `step`           | `number`                          | `1`     | Increment/decrement step    |
| `smallStep`      | `number`                          | —       | Step when holding Shift     |
| `largeStep`      | `number`                          | —       | Step when holding Ctrl/Cmd  |
| `disabled`       | `boolean`                         | `false` | Disables the field          |
| `readOnly`       | `boolean`                         | `false` | Makes the input read-only   |
| `formatOptions`  | `Intl.NumberFormatOptions`        | —       | Number formatting options   |
| `DecrementProps` | `NumberFieldDecrementProps`       | —       | Props for decrement button  |
| `IncrementProps` | `NumberFieldIncrementProps`       | —       | Props for increment button  |
| `InputProps`     | `NumberFieldInputProps`           | —       | Props for the input element |

## Keyboard Interactions

| Key       | Action                  |
| --------- | ----------------------- |
| `↑`       | Increment by step       |
| `↓`       | Decrement by step       |
| `Shift+↑` | Increment by smallStep  |
| `Shift+↓` | Decrement by smallStep  |
| `Ctrl+↑`  | Increment by largeStep  |
| `Ctrl+↓`  | Decrement by largeStep  |
| `Home`    | Set to min (if defined) |
| `End`     | Set to max (if defined) |

## Data Attributes

| Attribute   | Element   | Values                     | Description                 |
| ----------- | --------- | -------------------------- | --------------------------- |
| `data-slot` | decrement | `"number-field-decrement"` | Identifies decrement button |
| `data-slot` | increment | `"number-field-increment"` | Identifies increment button |

## CSS Variables

| Variable                   | Description                 |
| -------------------------- | --------------------------- |
| `--forms-background`       | Button background color     |
| `--forms-backgroundHover`  | Button background on hover  |
| `--forms-backgroundActive` | Button background on active |
| `--forms-border-color`     | Border color                |
| `--globals-border-radius`  | Border radius               |
| `--globals-icon-size`      | Icon size in buttons        |

## File Structure

```
number-field/
├── number-field.tsx              # Component implementation
├── number-field.types.ts         # TypeScript types
├── number-field.module.css       # Styles
├── number-field.stories.tsx      # Storybook stories
├── subcomponents/
│   ├── number-field-root.tsx     # Root container
│   ├── number-field-increment.tsx# Increment button
│   ├── number-field-decrement.tsx# Decrement button
│   └── index.ts                  # Subcomponent exports
└── README.md                     # This file
```

## TODO

- [ ] Implement scrub area for drag-to-change value ([Base UI docs](https://base-ui.com/react/components/number-field#scrub-area))
