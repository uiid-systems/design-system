# Popover

> Floating card attached to a trigger element

## Quick Reference

```tsx
import { Popover } from "@uiid/overlays";

// Basic usage
<Popover trigger={<button>Open</button>}>
  <p>Popover content</p>
</Popover>

// Controlled
<Popover open={isOpen} onOpenChange={setIsOpen} trigger={<button>Open</button>}>
  <p>Controlled popover</p>
</Popover>
```

## Examples

### Basic

```tsx
<Popover trigger={<button>Click me</button>}>
  <h3>Popover Title</h3>
  <p>Some helpful content here.</p>
</Popover>
```

### Controlled

```tsx
const [open, setOpen] = useState(false);

<Popover open={open} onOpenChange={setOpen} trigger={<button>Open</button>}>
  <p>Content</p>
  <button onClick={() => setOpen(false)}>Close</button>
</Popover>
```

### Custom Positioning

```tsx
<Popover
  trigger={<button>Open</button>}
  PositionerProps={{ side: "right", align: "start" }}
>
  Positioned to the right
</Popover>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `action` | `ReactNode` | — | — |
| `BackdropProps` | `any` | — | — |
| `description` | `ReactNode` | — | — |
| `footer` | `ReactNode` | — | — |
| `icon` | `ReactNode` | — | — |
| `onOpenChange` | `(...args: any[]) => any` | — | — |
| `open` | `boolean` | — | — |
| `PopupProps` | `any` | — | — |
| `PortalProps` | `any` | — | — |
| `PositionerProps` | `any` | — | — |
| `RootProps` | `any` | — | — |
| `title` | `ReactNode` | — | — |
| `trigger` | `ReactNode` | — | — |
| `TriggerProps` | `any` | — | — |

## Anatomy

```tsx
<PopoverRoot>
  <PopoverTrigger>{trigger}</PopoverTrigger>
  <PopoverPortal>
    <PopoverBackdrop />
    <PopoverPositioner>
      <PopoverPopup>{children}</PopoverPopup>
    </PopoverPositioner>
  </PopoverPortal>
</PopoverRoot>
```

## Data Slots

| Slot | Element |
|------|---------|
| `popover-backdrop` | Backdrop overlay |
| `popover-popup` | Popup container |

## Accessibility

- Trigger has `aria-expanded` and `aria-haspopup="dialog"`
- Opens with `Enter` or `Space` on trigger
- Closes with `Escape` or click outside
- Focus is managed within the popover

## See Also

- [Tooltip](../tooltip/README.md) - Hover-triggered simple popup
- [Modal](../modal/README.md) - Full dialog overlay
- [Base UI Popover](https://base-ui.com/react/components/popover) - Underlying primitive
