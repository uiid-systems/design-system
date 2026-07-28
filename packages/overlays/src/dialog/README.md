# Dialog

> Centered dialog overlay with Card-like content structure

## Quick Reference

```tsx
import { Dialog } from "@uiid/overlays";

// Controlled usage (required)
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen} trigger={<button>Open</button>}>
  <h2>Dialog Title</h2>
  <p>Dialog content here.</p>
</Dialog>
```

## Examples

### Basic

```tsx
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen} trigger={<button>Open Dialog</button>}>
  <h2>Welcome</h2>
  <p>This is a dialog dialog.</p>
  <button onClick={() => setOpen(false)}>Close</button>
</Dialog>
```

### Sizes

```tsx
<Dialog size="small" open={open} onOpenChange={setOpen} trigger={<button>Small</button>}>
  Small dialog
</Dialog>

<Dialog size="large" open={open} onOpenChange={setOpen} trigger={<button>Large</button>}>
  Large dialog
</Dialog>

<Dialog size="xlarge" open={open} onOpenChange={setOpen} trigger={<button>XLarge</button>}>
  Extra large dialog
</Dialog>
```

### Without Trigger

```tsx
const [open, setOpen] = useState(false);

<button onClick={() => setOpen(true)}>Open Externally</button>

<Dialog open={open} onOpenChange={setOpen}>
  <p>Opened programmatically</p>
</Dialog>
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
| `RootProps` | `any` | — | — |
| `size` | `"small" \| "medium" \| "large" \| "xlarge"` | `"medium"` | — |
| `title` | `ReactNode` | — | — |
| `trigger` | `ReactNode` | — | — |
| `TriggerProps` | `any` | — | — |

## Anatomy

```tsx
<DialogRoot>
  <DialogTrigger>{trigger}</DialogTrigger>
  <DialogPortal>
    <DialogBackdrop />
    <DialogPopup>{children}</DialogPopup>
  </DialogPortal>
</DialogRoot>
```

## Data Slots

| Slot | Element |
|------|---------|
| `dialog-backdrop` | Backdrop overlay |
| `dialog-popup` | Popup container |

## Accessibility

- Has `role="dialog"` with proper ARIA attributes
- Trigger has `aria-haspopup="dialog"`
- Closes with `Escape` key
- Focus is trapped within the dialog
- Focus returns to trigger on close
- Backdrop click closes by default

## See Also

- [Drawer](../drawer/README.md) - Edge-anchored panel with swipe-to-dismiss
- [Popover](../popover/README.md) - Positioned popup
- [Base UI Dialog](https://base-ui.com/react/components/dialog) - Underlying primitive
