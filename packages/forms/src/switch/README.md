# Switch

> Toggle switch with label and description support

## Quick Reference

```tsx
import { Switch } from "@uiid/forms";

// Basic
<Switch />

// With label
<Switch label="Enable notifications" />

// Variants
<Switch label="Dark mode" labelPosition="before" />
```

## Examples

### Basic

```tsx
<Switch label="Enable notifications" />
```

### Label Position

```tsx
<Switch label="Dark mode" labelPosition="before" />
<Switch label="Dark mode" labelPosition="after" />
```

### Controlled

```tsx
const [checked, setChecked] = useState(false);

<Switch
  label="Controlled switch"
  checked={checked}
  onCheckedChange={setChecked}
/>;
```

### Default Checked

```tsx
<Switch label="Enabled by default" defaultChecked />
```

### Disabled

```tsx
<Switch label="Cannot change" disabled />
```

## Props

| Prop             | Type      | Default | Description |
| ---------------- | --------- | ------- | ----------- |
| `bordered`       | `boolean` | —       | —           |
| `checked`        | `boolean` | —       | —           |
| `defaultChecked` | `boolean` | —       | —           |
| `description`    | `string`  | —       | —           |
| `disabled`       | `boolean` | —       | —           |
| `label`          | `string`  | —       | —           |
| `name`           | `string`  | —       | —           |
| `required`       | `boolean` | —       | —           |
| `reversed`       | `boolean` | —       | —           |

> All other props are forwarded to the Base UI Switch.Root component.

## Anatomy

```tsx
<SwitchField>
  {" "}
  {/* Container with label and description */}
  <SwitchRoot>
    {" "}
    {/* The switch track */}
    <SwitchThumb /> {/* The sliding thumb */}
  </SwitchRoot>
</SwitchField>
```

## Subcomponents

| Component     | Description                          |
| ------------- | ------------------------------------ |
| `SwitchRoot`  | The switch track element             |
| `SwitchThumb` | The sliding thumb element            |
| `SwitchField` | Container with label and description |

## Data Slots

| Slot           | Element           |
| -------------- | ----------------- |
| `switch-root`  | The switch track  |
| `switch-thumb` | The thumb element |

## Accessibility

- Built on Base UI Switch which handles ARIA attributes
- Keyboard: Space to toggle when focused
- Label is automatically associated via `htmlFor`

## See Also

- [Checkbox](../checkbox/README.md) - For independent toggles with checkmark
- [Base UI Switch](https://base-ui.com/react/components/switch) - Underlying primitive
