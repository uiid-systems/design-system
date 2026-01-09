# Modal

> A dialog overlay for focused interactions. Built on [Base UI Dialog](https://base-ui.com/react/components/dialog).

## Quick Reference

```tsx
import { Modal } from "@uiid/overlays";

// Controlled usage (required)
const [open, setOpen] = useState(false);

<Modal open={open} onOpenChange={setOpen} trigger={<button>Open</button>}>
  <h2>Modal Title</h2>
  <p>Modal content here.</p>
</Modal>
```

## Examples

### Basic

```tsx
const [open, setOpen] = useState(false);

<Modal open={open} onOpenChange={setOpen} trigger={<button>Open Modal</button>}>
  <h2>Welcome</h2>
  <p>This is a modal dialog.</p>
  <button onClick={() => setOpen(false)}>Close</button>
</Modal>
```

### Sizes

```tsx
<Modal size="small" open={open} onOpenChange={setOpen} trigger={<button>Small</button>}>
  Small modal
</Modal>

<Modal size="large" open={open} onOpenChange={setOpen} trigger={<button>Large</button>}>
  Large modal
</Modal>

<Modal size="xlarge" open={open} onOpenChange={setOpen} trigger={<button>XLarge</button>}>
  Extra large modal
</Modal>
```

### Without Trigger

```tsx
const [open, setOpen] = useState(false);

<button onClick={() => setOpen(true)}>Open Externally</button>

<Modal open={open} onOpenChange={setOpen}>
  <p>Opened programmatically</p>
</Modal>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Controlled open state (required) |
| `onOpenChange` | `(open: boolean, reason) => void` | — | Called when open state changes (required) |
| `trigger` | `ReactNode` | — | Element that opens the modal |
| `children` | `ReactNode` | — | Modal content |
| `size` | `"small" \| "medium" \| "large" \| "xlarge"` | — | Modal width |
| `RootProps` | `ModalRootProps` | — | Props for ModalRoot |
| `TriggerProps` | `ModalTriggerProps` | — | Props for trigger wrapper |
| `PortalProps` | `ModalPortalProps` | — | Props for portal |
| `BackdropProps` | `ModalBackdropProps` | — | Props for backdrop |
| `PopupProps` | `ModalPopupProps` | — | Props for popup element |

## Anatomy

```tsx
<ModalRoot>
  <ModalTrigger>{trigger}</ModalTrigger>
  <ModalPortal>
    <ModalBackdrop />
    <ModalPopup>{children}</ModalPopup>
  </ModalPortal>
</ModalRoot>
```

## Data Slots

| Slot | Element |
|------|---------|
| `modal-backdrop` | Backdrop overlay |
| `modal-popup` | Popup container |

## Accessibility

- Has `role="dialog"` with proper ARIA attributes
- Trigger has `aria-haspopup="dialog"`
- Closes with `Escape` key
- Focus is trapped within the modal
- Focus returns to trigger on close
- Backdrop click closes by default

## See Also

- [Sheet](../sheet/README.md) - Slide-in panel from edge
- [Popover](../popover/README.md) - Positioned popup
- [Base UI Dialog](https://base-ui.com/react/components/dialog) - Underlying primitive
