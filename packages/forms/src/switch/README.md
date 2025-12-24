# Switch

A toggle switch component built on [Base UI's Switch](https://base-ui.com/react/components/switch), with optional label support and configurable label positioning.

## Usage

```tsx
import { Switch } from "@uiid/forms";

<Switch />;
```

### With Label

```tsx
<Switch label="Enable notifications" />
```

### Label Position

The label can be placed before or after the switch. Defaults to `"after"`.

```tsx
<Switch label="Dark mode" labelPosition="before" />
<Switch label="Dark mode" labelPosition="after" />
```

### Disabled State

```tsx
<Switch label="Disabled switch" disabled />
```

### Controlled

Common props like `checked` and `onCheckedChange` are exposed directly for convenience:

```tsx
const [checked, setChecked] = useState(false);

<Switch
  label="Controlled switch"
  checked={checked}
  onCheckedChange={setChecked}
/>;
```

### Composing with Subcomponents

For advanced use cases, all subcomponents are exported for custom composition:

```tsx
import { SwitchRoot, SwitchThumb, SwitchLabel } from "@uiid/forms";

<SwitchRoot checked={checked} onCheckedChange={setChecked}>
  <SwitchThumb />
</SwitchRoot>;
```

## Props

Common props from Base UI's `Switch.Root` are exposed directly for convenience:

| Prop              | Type                         | Default   | Description                              |
| ----------------- | ---------------------------- | --------- | ---------------------------------------- |
| `checked`         | `boolean`                    | —         | Controlled checked state                 |
| `defaultChecked`  | `boolean`                    | —         | Initial checked state (uncontrolled)     |
| `onCheckedChange` | `(checked: boolean) => void` | —         | Callback when state changes              |
| `label`           | `string`                     | —         | Label text displayed next to the switch  |
| `labelPosition`   | `"before" \| "after"`        | `"after"` | Position of the label relative to switch |
| `name`            | `string`                     | —         | Form field name and label `htmlFor`      |
| `disabled`        | `boolean`                    | `false`   | Disables the switch                      |
| `RootProps`       | `SwitchRootProps`            | —         | Additional props for the root element    |
| `ThumbProps`      | `SwitchThumbProps`           | —         | Props passed to the thumb element        |

All other `Switch.Root` props are also supported at the top level.

## Data Attributes

| Attribute       | Element     | Values              | Description                  |
| --------------- | ----------- | ------------------- | ---------------------------- |
| `data-slot`     | root        | `"switch-root"`     | Identifies the root element  |
| `data-slot`     | thumb       | `"switch-thumb"`    | Identifies the thumb element |
| `data-slot`     | label       | `"switch-label"`    | Identifies the label element |
| `data-checked`  | root, thumb | Present when on     | Indicates checked state      |
| `data-disabled` | root, label | `"true" \| "false"` | Indicates disabled state     |

## CSS Variables

The switch uses design tokens from the globals and shade layers:

| Variable                      | Description                  |
| ----------------------------- | ---------------------------- |
| `--shade-surface`             | Background color (unchecked) |
| `--shade-halftone`            | Background color (checked)   |
| `--shade-foreground`          | Thumb color                  |
| `--globals-transition-timing` | Animation duration           |
| `--globals-disabled-opacity`  | Opacity when disabled        |

## File Structure

```
switch/
├── switch.tsx              # Component implementation
├── switch.types.ts         # TypeScript types
├── switch.module.css       # Styles
├── switch.stories.tsx      # Storybook stories
├── subcomponents/
│   ├── switch-root.tsx     # Root switch element
│   ├── switch-thumb.tsx    # Thumb/toggle element
│   ├── switch-label.tsx    # Label element
│   └── index.ts            # Subcomponent exports
└── README.md               # This file
```
