# Autocomplete

An input that suggests options as you type, built on [Base UI's Autocomplete](https://base-ui.com/react/components/autocomplete). Unlike Combobox, Autocomplete allows free-form text input while providing optional suggestions.

## Usage

```tsx
import { Autocomplete } from "@uiid/forms";

const items = ["apple", "banana", "cherry", "date", "elderberry"];

<Autocomplete items={items} />;
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
/>;
```

### Custom Item Rendering

For custom item content, pass a render function as children:

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

| Prop              | Type                          | Default | Description                    |
| ----------------- | ----------------------------- | ------- | ------------------------------ |
| `items`           | `string[]`                    | —       | **Required.** Array of options |
| `placeholder`     | `string`                      | —       | Placeholder text for input     |
| `defaultValue`    | `string`                      | —       | Initial value                  |
| `onValueChange`   | `(value: string) => void`     | —       | Callback when value changes    |
| `RootProps`       | `AutocompleteRootProps`       | —       | Props for the root element     |
| `InputProps`      | `AutocompleteInputProps`      | —       | Props for the input element    |
| `PortalProps`     | `AutocompletePortalProps`     | —       | Props for the portal           |
| `PositionerProps` | `AutocompletePositionerProps` | —       | Props for the positioner       |
| `PopupProps`      | `AutocompletePopupProps`      | —       | Props for the popup            |
| `ListProps`       | `AutocompleteListProps`       | —       | Props for the list container   |

## Keyboard Interactions

| Key      | Action                         |
| -------- | ------------------------------ |
| `↓`      | Open popup / highlight next    |
| `↑`      | Highlight previous             |
| `Enter`  | Select highlighted item        |
| `Escape` | Close popup                    |
| `Type`   | Filter items / enter free text |

## Relationship to Combobox

Autocomplete and Combobox share similar architecture but serve different purposes:

| Feature              | Autocomplete | Combobox |
| -------------------- | ------------ | -------- |
| Free-form text input | ✅ Yes       | ❌ No    |
| Selection required   | ❌ No        | ✅ Yes   |
| Suggestions          | Optional     | Required |

Use **Autocomplete** when:

- Users can enter custom values not in the list
- Suggestions are optional (like a search box)
- The input value doesn't need to match an item

Use **Combobox** when:

- Users must select from available options
- Input is used to filter, not for free text

## Data Attributes

| Attribute   | Element | Values                 | Description              |
| ----------- | ------- | ---------------------- | ------------------------ |
| `data-slot` | root    | `"autocomplete-root"`  | Identifies root element  |
| `data-slot` | input   | `"autocomplete-input"` | Identifies input element |
| `data-slot` | item    | `"autocomplete-item"`  | Identifies each item     |
| `data-slot` | popup   | `"autocomplete-popup"` | Identifies popup         |
| `data-slot` | empty   | `"autocomplete-empty"` | Identifies empty state   |

## CSS Variables

| Variable         | Description            |
| ---------------- | ---------------------- |
| `--anchor-width` | Popup min-width (auto) |
| `--shade-muted`  | Item focus background  |

## File Structure

```
autocomplete/
├── autocomplete.tsx              # Component implementation
├── autocomplete.types.ts         # TypeScript types
├── autocomplete.module.css       # Styles
├── autocomplete.stories.tsx      # Storybook stories
├── autocomplete.test.tsx         # Unit tests
├── subcomponents/
│   ├── autocomplete-root.tsx     # Root provider
│   ├── autocomplete-input.tsx    # Input element (uses Input)
│   ├── autocomplete-portal.tsx   # Portal wrapper
│   ├── autocomplete-positioner.tsx # Positioning logic
│   ├── autocomplete-popup.tsx    # Popup container (uses Card)
│   ├── autocomplete-list.tsx     # List container
│   ├── autocomplete-item.tsx     # Individual item (uses ListItem)
│   ├── autocomplete-empty.tsx    # Empty state message
│   └── index.ts                  # Subcomponent exports
└── README.md                     # This file
```
