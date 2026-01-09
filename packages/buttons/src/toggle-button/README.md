# ToggleButton

> A button that toggles between pressed and unpressed states. Built on [Base UI Toggle](https://base-ui.com/react/components/toggle).

## Quick Reference

```tsx
import { ToggleButton } from "@uiid/buttons";

// Basic usage
<ToggleButton>Toggle me</ToggleButton>

// With dynamic content
<ToggleButton
  text={{ pressed: "On", unpressed: "Off" }}
  icon={{ pressed: <CheckIcon />, unpressed: <XIcon /> }}
/>
```

## Examples

### Basic

```tsx
<ToggleButton>Toggle</ToggleButton>
<ToggleButton disabled>Disabled</ToggleButton>
```

### Dynamic Text

```tsx
<ToggleButton text={{ pressed: "Enabled", unpressed: "Disabled" }}>
  Default text
</ToggleButton>
```

### Dynamic Icons

```tsx
<ToggleButton
  icon={{
    pressed: <Heart fill="red" />,
    unpressed: <Heart />,
  }}
  square
/>
```

### Controlled

```tsx
const [pressed, setPressed] = useState(false);

<ToggleButton pressed={pressed} onPressedChange={setPressed}>
  {pressed ? "Active" : "Inactive"}
</ToggleButton>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pressed` | `boolean` | — | Controlled pressed state |
| `defaultPressed` | `boolean` | `false` | Initial pressed state (uncontrolled) |
| `onPressedChange` | `(pressed: boolean) => void` | — | Called when pressed state changes |
| `text` | `{ pressed: string; unpressed: string }` | — | Text content based on state |
| `icon` | `{ pressed: ReactNode; unpressed: ReactNode }` | — | Icon content based on state |
| `disabled` | `boolean` | `false` | Disable interactions |

> Inherits all props from [Button](../button/README.md) including `variant`, `size`, `tone`, etc.

## Data Slots

| Slot | Element |
|------|---------|
| `button` | Root button element (inherited from Button) |

## Accessibility

- Built on Base UI Toggle with `aria-pressed` attribute
- Keyboard: `Enter` and `Space` toggle state
- Screen readers announce pressed/unpressed state

## See Also

- [Button](../button/README.md) - Base button component
- [Base UI Toggle](https://base-ui.com/react/components/toggle) - Underlying primitive
