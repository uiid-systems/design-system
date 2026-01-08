# Slider

> A slider input for selecting numeric values. Built on [Base UI Slider](https://base-ui.com/react/components/slider).

## Quick Reference

```tsx
import { Slider } from "@uiid/forms";

// Basic
<Slider />

// With constraints
<Slider min={0} max={100} defaultValue={50} />

// With label
<Slider label="Volume" description="Adjust the volume level" />
```

## Examples

### Basic

```tsx
<Slider />
```

### With Label and Description

```tsx
<Slider
  label="Volume"
  description="Adjust the volume level"
/>
```

### Default Value

```tsx
<Slider defaultValue={50} />
```

### Min, Max, and Step

```tsx
<Slider min={0} max={100} step={10} defaultValue={50} />
```

### Controlled

```tsx
const [value, setValue] = useState(50);

<Slider value={value} onValueChange={setValue} />
```

### Vertical Orientation

```tsx
<Slider orientation="vertical" style={{ height: 200 }} />
```

### Format Value Display

```tsx
<Slider
  defaultValue={50}
  format={{ style: "percent" }}
/>

<Slider
  defaultValue={1000}
  format={{ style: "currency", currency: "USD" }}
/>
```

### Disabled

```tsx
<Slider disabled defaultValue={50} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | — | Controlled value |
| `defaultValue` | `number` | `50` | Initial value |
| `onValueChange` | `(value: number) => void` | — | Called when value changes |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `largeStep` | `number` | — | Step when using Page Up/Down |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Slider orientation |
| `disabled` | `boolean` | `false` | Disables the slider |
| `label` | `string` | — | Field label |
| `description` | `string` | — | Field description |
| `format` | `Intl.NumberFormatOptions` | — | Value display format |
| `locale` | `string` | — | Locale for value formatting |
| `ghost` | `boolean` | `false` | Ghost variant styling |
| `fullwidth` | `boolean` | `false` | Full width styling |

## Anatomy

```tsx
<Field>                  {/* Optional wrapper */}
  <SliderRoot>           {/* Provider */}
    <SliderControl>      {/* Interactive area */}
      <SliderTrack>      {/* Track element */}
        <SliderIndicator /> {/* Fill indicator */}
        <SliderThumb />  {/* Draggable thumb */}
      </SliderTrack>
    </SliderControl>
    <SliderValue />      {/* Value display */}
  </SliderRoot>
</Field>
```

## Subcomponents

| Component | Description |
|-----------|-------------|
| `SliderRoot` | Root provider component |
| `SliderControl` | Interactive control area |
| `SliderTrack` | The track element |
| `SliderIndicator` | Fill indicator showing current value |
| `SliderThumb` | Draggable thumb element |
| `SliderValue` | Formatted value display |

## Data Slots

| Slot | Element |
|------|---------|
| `slider-root` | The root element |
| `slider-control` | The control area |
| `slider-track` | The track element |
| `slider-indicator` | The fill indicator |
| `slider-thumb` | The thumb element |
| `slider-value` | The value display |

## Keyboard

| Key | Action |
|-----|--------|
| `←` / `↓` | Decrease by step |
| `→` / `↑` | Increase by step |
| `Page Down` | Decrease by largeStep |
| `Page Up` | Increase by largeStep |
| `Home` | Set to min |
| `End` | Set to max |

## Accessibility

- Built on Base UI Slider which handles ARIA attributes
- Keyboard navigation for precise control
- Focus visible indicator on thumb

## See Also

- [NumberField](../number-field/README.md) - Numeric input with buttons
- [Field](../field/README.md) - Field wrapper for labels
- [Base UI Slider](https://base-ui.com/react/components/slider) - Underlying primitive
