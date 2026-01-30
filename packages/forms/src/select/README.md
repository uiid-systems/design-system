# Select

> Dropdown select with customizable options, label, and description

## Quick Reference

```tsx
import { Select } from "@uiid/forms";

const items = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
];

// Basic
<Select items={items} />

// With label
<Select items={items} label="Framework" />

// Variants
<Select items={items} size="small" />
<Select items={items} placeholder="Select..." />
```

## Examples

### Basic

```tsx
<Select items={items} />
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

<Select items={items} />
```

### With Descriptions

```tsx
const items = [
  { value: "basic", label: "Basic", description: "For individuals" },
  { value: "pro", label: "Pro", description: "For teams" },
  { value: "enterprise", label: "Enterprise", description: "For organizations" },
];

<Select items={items} />
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

<Select items={items} defaultValue={value} onValueChange={setValue} />
```

### Disabled Items

```tsx
const items = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B", disabled: true },
  { value: "c", label: "Option C" },
];

<Select items={items} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | — | — |
| `description` | `string` | — | — |
| `disabled` | `boolean` | — | — |
| `fullwidth` | `boolean` | — | — |
| `ghost` | `boolean` | — | — |
| `items` | `object[]` | — | — |
| `label` | `string` | — | — |
| `placeholder` | `string` | — | — |
| `required` | `boolean` | — | — |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | — |
| `value` | `string` | — | — |

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

## Anatomy

```tsx
<SelectRoot>              {/* Provider */}
  <SelectTrigger>         {/* Trigger button */}
    <SelectValue />       {/* Display selected value */}
    <SelectIcon />        {/* Chevron icon */}
  </SelectTrigger>
  <SelectPortal>          {/* Portal wrapper */}
    <SelectPositioner>    {/* Positioning */}
      <SelectPopup>       {/* Popup container */}
        <SelectList>      {/* List wrapper */}
          <SelectItem />  {/* Individual items */}
        </SelectList>
      </SelectPopup>
    </SelectPositioner>
  </SelectPortal>
</SelectRoot>
```

## Subcomponents

| Component | Description |
|-----------|-------------|
| `SelectRoot` | Root provider component |
| `SelectTrigger` | The trigger button |
| `SelectValue` | Displays selected value |
| `SelectIcon` | Chevron indicator |
| `SelectPopup` | Popup container |
| `SelectList` | List container |
| `SelectItem` | Individual option item |

## Data Slots

| Slot | Element |
|------|---------|
| `select-trigger` | The trigger button |
| `select-value` | The value display |
| `select-icon` | The chevron icon |
| `select-item` | Each option item |

## Accessibility

- Built on Base UI Select which handles ARIA attributes
- Keyboard: Arrow keys to navigate, Enter to select, Escape to close
- Focus management handled automatically

## See Also

- [Combobox](../combobox/README.md) - Searchable select with filtering
- [Autocomplete](../autocomplete/README.md) - Free-form text with suggestions
- [Base UI Select](https://base-ui.com/react/components/select) - Underlying primitive
