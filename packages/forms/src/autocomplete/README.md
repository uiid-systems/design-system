# Autocomplete

> An input with suggestions that allows free-form text. Built on [Base UI Autocomplete](https://base-ui.com/react/components/autocomplete). Unlike Combobox, selection is optional.

## Quick Reference

```tsx
import { Autocomplete } from "@uiid/forms";

const items = ["apple", "banana", "cherry", "date", "elderberry"];

// Basic
<Autocomplete items={items} />

// With placeholder
<Autocomplete items={items} placeholder="Search fruits..." />

// With default value
<Autocomplete items={items} defaultValue="banana" />
```

## Examples

### Basic

```tsx
<Autocomplete items={items} />
```

### With Placeholder

```tsx
<Autocomplete items={items} placeholder="Search fruits..." />
```

### Default Value

```tsx
<Autocomplete items={items} defaultValue="banana" />
```

### Controlled

```tsx
const [value, setValue] = useState<string | null>(null);

<Autocomplete
  items={items}
  RootProps={{
    value,
    onValueChange: setValue,
  }}
/>
```

### Custom Item Rendering

```tsx
<Autocomplete items={items}>
  {(item: string) => (
    <AutocompleteItem key={item} value={item}>
      <span>🍎 {item}</span>
    </AutocompleteItem>
  )}
</Autocomplete>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `string[]` | — | **Required.** Array of suggestion options |
| `placeholder` | `string` | — | Placeholder text for input |
| `defaultValue` | `string` | — | Initial value |
| `onValueChange` | `(value: string) => void` | — | Called when value changes |
| `RootProps` | `AutocompleteRootProps` | — | Props for the root element |
| `InputProps` | `AutocompleteInputProps` | — | Props for the input element |
| `PopupProps` | `AutocompletePopupProps` | — | Props for the popup |
| `ListProps` | `AutocompleteListProps` | — | Props for the list container |

## Anatomy

```tsx
<AutocompleteRoot>              {/* Provider */}
  <AutocompleteInput />         {/* Text input */}
  <AutocompletePortal>          {/* Portal wrapper */}
    <AutocompletePositioner>    {/* Positioning */}
      <AutocompletePopup>       {/* Popup container */}
        <AutocompleteList>      {/* List wrapper */}
          <AutocompleteItem />  {/* Individual items */}
        </AutocompleteList>
        <AutocompleteEmpty />   {/* Empty state */}
      </AutocompletePopup>
    </AutocompletePositioner>
  </AutocompletePortal>
</AutocompleteRoot>
```

## Subcomponents

| Component | Description |
|-----------|-------------|
| `AutocompleteRoot` | Root provider component |
| `AutocompleteInput` | The text input |
| `AutocompletePopup` | Popup container |
| `AutocompleteList` | List container |
| `AutocompleteItem` | Individual suggestion item |
| `AutocompleteEmpty` | Empty state message |

## Data Slots

| Slot | Element |
|------|---------|
| `autocomplete-root` | The root element |
| `autocomplete-input` | The input element |
| `autocomplete-popup` | The popup container |
| `autocomplete-item` | Each suggestion item |
| `autocomplete-empty` | Empty state element |

## Autocomplete vs Combobox

| Feature | Autocomplete | Combobox |
|---------|--------------|----------|
| Free-form text input | Yes | No |
| Selection required | No | Yes |
| Suggestions | Optional | Required |

Use **Autocomplete** when users can enter custom values not in the list (like a search box).

Use **Combobox** when users must select from available options.

## Accessibility

- Built on Base UI Autocomplete which handles ARIA attributes
- Keyboard: Arrow keys to navigate, Enter to select, Escape to close
- Typing filters the suggestions

## See Also

- [Combobox](../combobox/README.md) - Selection required from filtered options
- [Select](../select/README.md) - Dropdown without text input
- [Input](../input/README.md) - Plain text input
- [Base UI Autocomplete](https://base-ui.com/react/components/autocomplete) - Underlying primitive
