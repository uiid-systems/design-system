# Radio

A radio button component built on [Base UI's Radio](https://base-ui.com/react/components/radio), designed to be used within a RadioGroup for mutually exclusive selections.

## Usage

Radio must be used within a RadioGroup:

```tsx
import { Radio, RadioGroup } from "@uiid/forms";

<RadioGroup defaultValue="a">
  <Radio value="a" label="Option A" />
  <Radio value="b" label="Option B" />
  <Radio value="c" label="Option C" />
</RadioGroup>;
```

### With Description

```tsx
<RadioGroup defaultValue="monthly">
  <Radio
    value="monthly"
    label="Monthly"
    description="$10/month, billed monthly"
  />
  <Radio value="yearly" label="Yearly" description="$100/year, save 17%" />
</RadioGroup>
```

### Bordered Variant

Card-style selection pattern:

```tsx
<RadioGroup defaultValue="a">
  <Radio bordered value="a" label="Basic" description="For individuals" />
  <Radio bordered value="b" label="Pro" description="For teams" />
</RadioGroup>
```

### Reversed Layout

Places the radio after the label:

```tsx
<RadioGroup defaultValue="a">
  <Radio reversed value="a" label="Radio on the right" />
  <Radio reversed value="b" label="Another option" />
</RadioGroup>
```

### Hidden Indicator

For card-style selections where the border indicates selection:

```tsx
<RadioGroup defaultValue="a">
  <Radio bordered hideIndicator value="a" label="Card A" />
  <Radio bordered hideIndicator value="b" label="Card B" />
</RadioGroup>
```

## Props

| Prop             | Type                  | Default | Description                              |
| ---------------- | --------------------- | ------- | ---------------------------------------- |
| `value`          | `string`              | —       | **Required.** Value for the radio option |
| `label`          | `ReactNode`           | —       | Label text                               |
| `description`    | `ReactNode`           | —       | Helper text below the label              |
| `bordered`       | `boolean`             | `false` | Wraps in bordered container              |
| `reversed`       | `boolean`             | `false` | Places radio after label                 |
| `hideIndicator`  | `boolean`             | `false` | Visually hides the radio circle          |
| `disabled`       | `boolean`             | `false` | Disables the radio option                |
| `ContainerProps` | `GroupProps`          | —       | Props for the container element          |
| `IndicatorProps` | `RadioIndicatorProps` | —       | Props for the indicator element          |

## Relationship to Checkbox

Radio shares the same field layout system as Checkbox via `CheckboxField`. Both support:

- `label` and `description`
- `bordered` and `reversed` variants
- Similar visual styling

Use Radio within a RadioGroup for mutually exclusive options. Use Checkbox for independent toggles.

## Data Attributes

| Attribute        | Element   | Values              | Description                 |
| ---------------- | --------- | ------------------- | --------------------------- |
| `data-slot`      | root      | `"radio"`           | Identifies the root element |
| `data-slot`      | indicator | `"radio-indicator"` | Identifies the indicator    |
| `data-checked`   | root      | Present when on     | Indicates selected state    |
| `data-unchecked` | root      | Present when off    | Indicates unselected state  |
| `data-bordered`  | container | `true`              | Bordered variant active     |
| `data-reversed`  | container | `"true"`            | Reversed layout active      |

## CSS Variables

| Variable               | Description               |
| ---------------------- | ------------------------- |
| `--forms-background`   | Background color          |
| `--forms-border-color` | Border color              |
| `--shade-foreground`   | Selected background color |
| `--shade-halftone`     | Indicator dot color       |

## File Structure

```
radio/
├── radio.tsx              # Component implementation
├── radio.types.ts         # TypeScript types
├── radio.module.css       # Styles
├── radio.test.tsx         # Unit tests
├── subcomponents/
│   ├── radio-root.tsx     # Root radio element
│   ├── radio-indicator.tsx# Selection indicator
│   └── index.ts           # Subcomponent exports
└── README.md              # This file
```
