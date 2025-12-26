# Combobox

An autocomplete/combobox component built on [Base UI's Combobox](https://base-ui.com/react/components/combobox), with support for filtering, keyboard navigation, and custom items.

## Usage

```tsx
import { Combobox } from "@uiid/forms";

const items = ["apple", "banana", "cherry", "date", "elderberry"];

<Combobox items={items} />;
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
/>;
```

### Custom Item Rendering

For custom item content, pass a render function as children:

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

| Prop              | Type                      | Default | Description                       |
| ----------------- | ------------------------- | ------- | --------------------------------- |
| `items`           | `string[]`                | —       | **Required.** Array of options    |
| `placeholder`     | `string`                  | —       | Placeholder text for input        |
| `defaultValue`    | `string`                  | —       | Initial selected value            |
| `onValueChange`   | `(value: string) => void` | —       | Callback when selection changes   |
| `RootProps`       | `ComboboxRootProps`       | —       | Props for the root element        |
| `InputProps`      | `ComboboxInputProps`      | —       | Props for the input element       |
| `PortalProps`     | `ComboboxPortalProps`     | —       | Props for the portal              |
| `PositionerProps` | `ComboboxPositionerProps` | —       | Props for the positioner          |
| `PopupProps`      | `ComboboxPopupProps`      | —       | Props for the popup               |
| `ListProps`       | `ComboboxListProps`       | —       | Props for the list container      |

## Keyboard Interactions

| Key          | Action                         |
| ------------ | ------------------------------ |
| `↓`          | Open popup / highlight next    |
| `↑`          | Highlight previous             |
| `Enter`      | Select highlighted item        |
| `Escape`     | Close popup                    |
| `Type`       | Filter items                   |

## Relationship to Select

Combobox shares some types with Select:

- `SelectMultiple` type is reused for multi-select support
- Similar popup/positioner architecture
- Both use `ListItem` for consistent item rendering

Use **Select** when users choose from a fixed list.
Use **Combobox** when users need to search/filter options or enter custom values.

## Data Attributes

| Attribute   | Element | Values             | Description                |
| ----------- | ------- | ------------------ | -------------------------- |
| `data-slot` | root    | `"combobox-root"`  | Identifies root element    |
| `data-slot` | input   | `"combobox-input"` | Identifies input element   |
| `data-slot` | item    | `"combobox-item"`  | Identifies each item       |

## CSS Variables

| Variable           | Description                   |
| ------------------ | ----------------------------- |
| `--anchor-width`   | Popup min-width (auto)        |
| `--shade-accent`   | Action button color           |
| `--shade-muted`    | Item focus background         |

## File Structure

```
combobox/
├── combobox.tsx              # Component implementation
├── combobox.types.ts         # TypeScript types
├── combobox.module.css       # Styles
├── combobox.stories.tsx      # Storybook stories
├── combobox.mocks.ts         # Mock data for stories/tests
├── combobox.test.tsx         # Unit tests
├── subcomponents/
│   ├── combobox-root.tsx     # Root provider
│   ├── combobox-input.tsx    # Input element
│   ├── combobox-action-buttons.tsx # Clear/chevron buttons
│   ├── combobox-portal.tsx   # Portal wrapper
│   ├── combobox-positioner.tsx # Positioning logic
│   ├── combobox-popup.tsx    # Popup container
│   ├── combobox-list.tsx     # List container
│   ├── combobox-item.tsx     # Individual item
│   ├── combobox-empty.tsx    # Empty state message
│   └── index.ts              # Subcomponent exports
└── README.md                 # This file
```

