# Select

A dropdown select component built on [Base UI's Select](https://base-ui.com/react/components/select), with support for labels, descriptions, icons, and rich item content.

## Usage

```tsx
import { Select } from "@uiid/forms";

const items = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
];

<Select items={items} />;
```

### With Label and Description

```tsx
<Select
  items={items}
  label="Framework"
  description="Choose your preferred framework"
/>
```

### Default Value

```tsx
<Select items={items} defaultValue="vue" />
```

### Placeholder

```tsx
<Select items={items} placeholder="Select a framework..." />
```

### With Icons

```tsx
import { Home, Star, Hammer } from "@uiid/icons";

const items = [
  { value: "home", label: "Home", icon: Home },
  { value: "favorites", label: "Favorites", icon: Star },
  { value: "tools", label: "Tools", icon: Hammer },
];

<Select items={items} />;
```

### With Descriptions

```tsx
const items = [
  { value: "basic", label: "Basic", description: "For individuals" },
  { value: "pro", label: "Pro", description: "For teams" },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "For organizations",
  },
];

<Select items={items} />;
```

### Disabled Items

```tsx
const items = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B", disabled: true },
  { value: "c", label: "Option C" },
];

<Select items={items} />;
```

### Sizes

```tsx
<Select items={items} size="small" />
<Select items={items} size="medium" />
<Select items={items} size="large" />
```

### Controlled

```tsx
const [value, setValue] = useState("react");

<Select items={items} defaultValue={value} onValueChange={setValue} />;
```

### Custom Children

For advanced use cases, pass children instead of items:

```tsx
import { SelectItem } from "@uiid/forms";

<Select>
  <SelectItem value="custom" label="Custom Item" />
</Select>;
```

## Props

| Prop              | Type                      | Default    | Description                            |
| ----------------- | ------------------------- | ---------- | -------------------------------------- |
| `items`           | `SelectItemProps[]`       | —          | Array of select options                |
| `defaultValue`    | `string`                  | First item | Initial selected value                 |
| `onValueChange`   | `(value: string) => void` | —          | Callback when selection changes        |
| `placeholder`     | `string`                  | —          | Placeholder text when nothing selected |
| `size`            | `"sm" \| "md" \| "lg"`    | `"md"`     | Size of the trigger                    |
| `label`           | `ReactNode`               | —          | Label text                             |
| `description`     | `ReactNode`               | —          | Helper text below the select           |
| `error`           | `ReactNode`               | —          | Error message                          |
| `disabled`        | `boolean`                 | `false`    | Disables the select                    |
| `RootProps`       | `SelectRootProps`         | —          | Props for the root element             |
| `TriggerProps`    | `SelectTriggerProps`      | —          | Props for the trigger button           |
| `PortalProps`     | `SelectPortalProps`       | —          | Props for the portal                   |
| `PositionerProps` | `SelectPositionerProps`   | —          | Props for the positioner               |
| `PopupProps`      | `SelectPopupProps`        | —          | Props for the popup                    |
| `ListProps`       | `SelectListProps`         | —          | Props for the list container           |

### SelectItemProps

```ts
type SelectItemProps = {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: Icon;
};
```

## Data Attributes

| Attribute   | Element | Values                 | Description                  |
| ----------- | ------- | ---------------------- | ---------------------------- |
| `data-slot` | trigger | `"select-trigger"`     | Identifies the trigger       |
| `data-slot` | value   | `"select-value"`       | Identifies the value display |
| `data-slot` | icon    | `"select-icon"`        | Identifies the chevron icon  |
| `data-slot` | item    | `"select-item"`        | Identifies each item         |
| `data-size` | trigger | `"sm" \| "md" \| "lg"` | Current size variant         |

## CSS Variables

Uses input styling from the forms package:

| Variable               | Description            |
| ---------------------- | ---------------------- |
| `--forms-background`   | Trigger background     |
| `--forms-border-color` | Border color           |
| `--forms-padding-x`    | Horizontal padding     |
| `--forms-padding-y`    | Vertical padding       |
| `--anchor-width`       | Popup min-width (auto) |

## File Structure

```
select/
├── select.tsx              # Component implementation
├── select.types.ts         # TypeScript types
├── select.constants.ts     # Default values
├── select.module.css       # Styles
├── select.stories.tsx      # Storybook stories
├── select.mocks.tsx        # Mock data for stories/tests
├── select.test.tsx         # Unit tests
├── subcomponents/
│   ├── select-root.tsx     # Root provider
│   ├── select-trigger.tsx  # Trigger button
│   ├── select-portal.tsx   # Portal wrapper
│   ├── select-positioner.tsx # Positioning logic
│   ├── select-popup.tsx    # Popup container
│   ├── select-list.tsx     # List container
│   ├── select-item.tsx     # Individual item
│   └── index.ts            # Subcomponent exports
└── README.md               # This file
```
