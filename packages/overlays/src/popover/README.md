# Popover

> A popup triggered by clicking that displays rich content. Built on [Base UI Popover](https://base-ui.com/react/components/popover).

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
| `trigger` | `ReactNode` | — | Element that opens the popover |
| `children` | `ReactNode` | — | Popover content |
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open: boolean, reason) => void` | — | Called when open state changes |
| `RootProps` | `PopoverRootProps` | — | Props for PopoverRoot |
| `TriggerProps` | `PopoverTriggerProps` | — | Props for trigger wrapper |
| `PortalProps` | `PopoverPortalProps` | — | Props for portal |
| `BackdropProps` | `PopoverBackdropProps` | — | Props for backdrop |
| `PositionerProps` | `PopoverPositionerProps` | `{ sideOffset: 4, collisionPadding: 16 }` | Positioning options |
| `PopupProps` | `PopoverPopupProps` | — | Props for popup element |

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
