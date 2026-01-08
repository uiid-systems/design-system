# Radio

> A radio button for single-selection within a group. Built on [Base UI Radio](https://base-ui.com/react/components/radio). Must be used within a RadioGroup.

## Quick Reference

```tsx
import { RadioGroup } from "@uiid/forms";

const items = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
];

// Use via RadioGroup (recommended)
<RadioGroup items={items} />

// Or compose manually
<RadioGroup defaultValue="a">
  <Radio value="a" label="Option A" />
  <Radio value="b" label="Option B" />
</RadioGroup>
```

## Examples

### With Description

```tsx
<RadioGroup defaultValue="monthly">
  <Radio
    value="monthly"
    label="Monthly"
    description="$10/month, billed monthly"
  />
  <Radio
    value="yearly"
    label="Yearly"
    description="$100/year, save 17%"
  />
</RadioGroup>
```

### Bordered

Card-style selection pattern:

```tsx
<RadioGroup defaultValue="basic">
  <Radio bordered value="basic" label="Basic" description="For individuals" />
  <Radio bordered value="pro" label="Pro" description="For teams" />
</RadioGroup>
```

### Reversed

Places radio after label:

```tsx
<RadioGroup defaultValue="a">
  <Radio reversed value="a" label="Radio on the right" />
  <Radio reversed value="b" label="Another option" />
</RadioGroup>
```

### Hidden Indicator

For card selections where border indicates selection:

```tsx
<RadioGroup defaultValue="a">
  <Radio bordered hideIndicator value="a" label="Card A" />
  <Radio bordered hideIndicator value="b" label="Card B" />
</RadioGroup>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | **Required.** Value for the radio option |
| `label` | `ReactNode` | — | Label text |
| `description` | `ReactNode` | — | Helper text below label |
| `bordered` | `boolean` | `false` | Adds border around radio and label |
| `reversed` | `boolean` | `false` | Places radio after label |
| `hideIndicator` | `boolean` | `false` | Hides the radio circle |
| `disabled` | `boolean` | `false` | Disables the radio option |
| `ContainerProps` | `GroupProps` | — | Props for container element |
| `IndicatorProps` | `RadioIndicatorProps` | — | Props for indicator element |

## Anatomy

```tsx
<CheckboxField>        {/* Shared with Checkbox */}
  <RadioRoot>          {/* The radio control */}
    <RadioIndicator /> {/* Selection dot */}
  </RadioRoot>
</CheckboxField>
```

## Subcomponents

| Component | Description |
|-----------|-------------|
| `RadioRoot` | The radio control element |
| `RadioIndicator` | The selection dot |

## Data Slots

| Slot | Element |
|------|---------|
| `radio` | The radio root element |

## Accessibility

- Built on Base UI Radio which handles ARIA attributes
- Must be used within RadioGroup for proper grouping
- Keyboard: Arrow keys to navigate, Space to select

## See Also

- [RadioGroup](../radio-group/README.md) - Container for radio buttons
- [Checkbox](../checkbox/README.md) - For independent toggles
- [Base UI Radio](https://base-ui.com/react/components/radio) - Underlying primitive
