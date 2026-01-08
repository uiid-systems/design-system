# Combobox

> A searchable select that requires selection from filtered options. Built on [Base UI Combobox](https://base-ui.com/react/components/combobox).

## Quick Reference

```tsx
import { Combobox } from "@uiid/forms";

const items = ["apple", "banana", "cherry", "date", "elderberry"];

// Basic
<Combobox items={items} />

// With placeholder
<Combobox items={items} placeholder="Search fruits..." />

// With default value
<Combobox items={items} defaultValue="banana" />
```

## Examples

### Basic

```tsx
<Combobox items={items} />
```

### With Placeholder

```tsx
<Combobox items={items} placeholder="Search fruits..." />
```

### Default Value

```tsx
<Combobox items={items} defaultValue="banana" />
```

### Controlled

```tsx
const [value, setValue] = useState<string | null>(null);

<Combobox
  items={items}
  RootProps={{
    value,
    onValueChange: setValue,
  }}
/>
```

### Custom Item Rendering

```tsx
<Combobox items={items}>
  {(item: string) => (
    <ComboboxItem key={item} value={item}>
      <span>🍎 {item}</span>
    </ComboboxItem>
  )}
</Combobox>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `string[]` | — | **Required.** Array of options |
| `placeholder` | `string` | — | Placeholder text for input |
| `defaultValue` | `string` | — | Initial selected value |
| `onValueChange` | `(value: string) => void` | — | Called when selection changes |
| `RootProps` | `ComboboxRootProps` | — | Props for the root element |
| `InputProps` | `ComboboxInputProps` | — | Props for the input element |
| `PopupProps` | `ComboboxPopupProps` | — | Props for the popup |
| `ListProps` | `ComboboxListProps` | — | Props for the list container |

## Anatomy

```tsx
<ComboboxRoot>              {/* Provider */}
  <ComboboxInput />         {/* Search input */}
  <ComboboxActionButtons /> {/* Clear/chevron buttons */}
  <ComboboxPortal>          {/* Portal wrapper */}
    <ComboboxPositioner>    {/* Positioning */}
      <ComboboxPopup>       {/* Popup container */}
        <ComboboxList>      {/* List wrapper */}
          <ComboboxItem />  {/* Individual items */}
        </ComboboxList>
        <ComboboxEmpty />   {/* Empty state */}
      </ComboboxPopup>
    </ComboboxPositioner>
  </ComboboxPortal>
</ComboboxRoot>
```

## Subcomponents

| Component | Description |
|-----------|-------------|
| `ComboboxRoot` | Root provider component |
| `ComboboxInput` | The search input |
| `ComboboxActionButtons` | Clear and chevron buttons |
| `ComboboxPopup` | Popup container |
| `ComboboxList` | List container |
| `ComboboxItem` | Individual option item |
| `ComboboxEmpty` | Empty state message |

## Data Slots

| Slot | Element |
|------|---------|
| `combobox-root` | The root element |
| `combobox-input` | The input element |
| `combobox-item` | Each option item |

## Combobox vs Autocomplete vs Select

| Feature | Combobox | Autocomplete | Select |
|---------|----------|--------------|--------|
| Text input | Yes (filter) | Yes (free-form) | No |
| Selection required | Yes | No | Yes |
| Custom values | No | Yes | No |

Use **Combobox** when users must select from a searchable list.

Use **Autocomplete** when users can enter custom values.

Use **Select** when options are few and don't need filtering.

## Accessibility

- Built on Base UI Combobox which handles ARIA attributes
- Keyboard: Arrow keys to navigate, Enter to select, Escape to close
- Typing filters the options

## See Also

- [Autocomplete](../autocomplete/README.md) - Free-form text with optional suggestions
- [Select](../select/README.md) - Dropdown without text input
- [Base UI Combobox](https://base-ui.com/react/components/combobox) - Underlying primitive
