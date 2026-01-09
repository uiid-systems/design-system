# Layer

> A layout component for stacking children on top of each other, with optional offset for visual effects like avatar stacks.

## Quick Reference

```tsx
import { Layer } from "@uiid/layout";

// Basic overlapping
<Layer>
  <div>Background</div>
  <div>Foreground</div>
</Layer>

// Avatar stack with offset
<Layer offset={{ x: -8 }}>
  <Avatar src={user1} />
  <Avatar src={user2} />
  <Avatar src={user3} />
</Layer>
```

## Examples

### Basic Overlay

```tsx
<Layer>
  <img src={background} alt="" />
  <div className="overlay">Overlay text</div>
</Layer>
```

### Centered Overlay

```tsx
<Layer ax="center" ay="center">
  <img src={image} alt="" />
  <span className="badge">NEW</span>
</Layer>
```

### Avatar Stack

```tsx
<Layer offset={{ x: -8 }}>
  <Avatar src={user1} alt="User 1" />
  <Avatar src={user2} alt="User 2" />
  <Avatar src={user3} alt="User 3" />
</Layer>
```

### Card Stack

```tsx
<Layer offset={{ x: 4, y: 4 }}>
  <div className="card">Card 1</div>
  <div className="card">Card 2</div>
  <div className="card">Card 3</div>
</Layer>
```

### Image with Badge

```tsx
<Layer>
  <img src={product} alt="Product" />
  <span className="sale-badge">SALE</span>
</Layer>
```

### Profile with Status

```tsx
<Layer>
  <Avatar src={user} size={48} />
  <span className="status-indicator online" />
</Layer>
```

## Offset Behavior

The `offset` prop shifts each child by a cumulative amount:

```tsx
<Layer offset={{ x: 10, y: 5 }}>
  <div>Position: translate(0px, 0px)</div>
  <div>Position: translate(10px, 5px)</div>
  <div>Position: translate(20px, 10px)</div>
</Layer>
```

Negative offsets create overlapping effects:

```tsx
<Layer offset={{ x: -12 }}>
  <Avatar /> {/* translate(0, 0) */}
  <Avatar /> {/* translate(-12px, 0) - overlaps first */}
  <Avatar /> {/* translate(-24px, 0) - overlaps second */}
</Layer>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `offset` | `{ x?: number; y?: number }` | — | Pixel offset per child |
| `ax` | `"start" \| "center" \| "end" \| "stretch"` | — | Horizontal alignment |
| `ay` | `"start" \| "center" \| "end" \| "stretch"` | — | Vertical alignment |
| `className` | `string` | — | Additional CSS classes |
| `style` | `CSSProperties` | — | Inline styles |

> Inherits all Box props (padding, margin, fullwidth, etc.)

## Data Slots

| Slot | Element |
|------|---------|
| `layer` | Root layer element |

## Styling

Layer uses CSS grid to stack children:

```css
[data-slot="layer"] {
  display: grid;
  grid-template-areas: "layer";
}

[data-slot="layer"] > * {
  grid-area: layer;
}
```

## See Also

- [Box](../box/README.md) - Underlying primitive
- [Stack](../stack/README.md) - Vertical stacking (not overlapping)
- [Group](../group/README.md) - Horizontal layout
