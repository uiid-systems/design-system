# SelectMultiple

> A dropdown select for choosing multiple options from a list. Built on [Base UI Select](https://base-ui.com/react/components/select) with `multiple` mode enabled.

## Quick Reference

```tsx
import { SelectMultiple } from "@uiid/forms";

const items = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
];

// Basic
<SelectMultiple items={items} />

// With default selection
<SelectMultiple items={items} defaultValue={["react", "vue"]} />

// With label
<SelectMultiple items={items} label="Frameworks" />

// Sizes
<SelectMultiple items={items} size="small" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `SelectItemProps[]` | — | Array of selectable options |
| `defaultValue` | `string[]` | `[]` | Initially selected values |
| `value` | `string[]` | — | Controlled selected values |
| `onValueChange` | `(value: string[]) => void` | — | Callback when selection changes |
| `size` | `"small" \| "medium" \| "large"` | `"small"` | Trigger size |
| `label` | `string` | — | Field label |
| `description` | `string` | — | Helper text below the field |
| `disabled` | `boolean` | `false` | Disables the select |
| `required` | `boolean` | `false` | Marks field as required |
| `name` | `string` | — | Form field name |
| `fullwidth` | `boolean` | `false` | Full width trigger |
| `ghost` | `boolean` | `false` | Ghost variant styling |

### Item Props

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Unique value for the item |
| `label` | `string` | Display text |
| `disabled` | `boolean` | Disables the item |
| `description` | `string` | Secondary text |
| `icon` | `Icon` | Leading icon |

## Anatomy

```tsx
<SelectMultiple>
  └── <SelectTrigger>         {/* Trigger button */}
        ├── <SelectValue />   {/* Displays selected values */}
        └── <SelectIndicator /> {/* Chevron icon */}
      <SelectPortal>          {/* Portal wrapper */}
        └── <SelectPositioner>
              └── <SelectPopup>
                    └── <SelectList>
                          └── <SelectItem />  {/* Individual options */}
```

## Subcomponents

For advanced composition, the following subcomponents are available:

| Component | Description |
|-----------|-------------|
| `SelectTrigger` | The trigger button |
| `SelectValue` | Displays selected values |
| `SelectIndicator` | Chevron icon |
| `SelectPortal` | Portal container |
| `SelectPositioner` | Positions the popup |
| `SelectPopup` | Popup container |
| `SelectList` | List container |
| `SelectItem` | Individual option |

## Data Slots

| Slot | Element |
|------|---------|
| `select-multiple-root` | Root element |
| `select-trigger` | Trigger button |
| `select-value` | Value display |
| `select-icon` | Chevron indicator |
| `select-item` | List item |

## Accessibility

- Built on Base UI which handles ARIA attributes for multi-select
- `aria-multiselectable="true"` on the listbox
- `aria-selected` indicates selection state on each option
- Keyboard navigation: Arrow keys to navigate, Space/Enter to toggle selection

## See Also

- [Select](../select/README.md) - Single-select dropdown
- [Combobox](../combobox/README.md) - Searchable select with autocomplete
- [Base UI Select](https://base-ui.com/react/components/select) - Underlying primitive
