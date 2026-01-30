# Sheet

> Slide-in panel overlay from any edge of the screen

## Quick Reference

```tsx
import { Sheet } from "@uiid/overlays";

// Basic usage
<Sheet trigger={<button>Open</button>}>
  <h2>Sheet Content</h2>
  <p>Slides in from the right by default.</p>
</Sheet>

// Controlled
<Sheet open={open} onOpenChange={setOpen} side="left" trigger={<button>Open</button>}>
  <p>Left-side sheet</p>
</Sheet>
```

## Examples

### Basic

```tsx
<Sheet trigger={<button>Open Sheet</button>}>
  <h2>Settings</h2>
  <p>Configure your preferences here.</p>
</Sheet>
```

### Sides

```tsx
<Sheet side="left" trigger={<button>Left</button>}>
  Slides from left
</Sheet>

<Sheet side="right" trigger={<button>Right</button>}>
  Slides from right (default)
</Sheet>

<Sheet side="top" trigger={<button>Top</button>}>
  Slides from top
</Sheet>

<Sheet side="bottom" trigger={<button>Bottom</button>}>
  Slides from bottom
</Sheet>
```

### Controlled

```tsx
const [open, setOpen] = useState(false);

<Sheet open={open} onOpenChange={setOpen} trigger={<button>Open</button>}>
  <h2>Navigation</h2>
  <nav>
    <a href="/home">Home</a>
    <a href="/about">About</a>
  </nav>
  <button onClick={() => setOpen(false)}>Close</button>
</Sheet>
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
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"right"` | — |
| `title` | `ReactNode` | — | — |
| `trigger` | `ReactNode` | — | — |
| `TriggerProps` | `any` | — | — |

## Anatomy

```tsx
<SheetRoot>
  <SheetTrigger>{trigger}</SheetTrigger>
  <SheetPortal>
    <SheetBackdrop />
    <SheetPopup>{children}</SheetPopup>
  </SheetPortal>
</SheetRoot>
```

## Data Slots

| Slot | Element |
|------|---------|
| `sheet-backdrop` | Backdrop overlay |

## Accessibility

- Has `role="dialog"` with proper ARIA attributes
- Trigger has `aria-haspopup="dialog"`
- Closes with `Escape` key
- Focus is trapped within the sheet
- Focus returns to trigger on close
- Backdrop click closes by default

## See Also

- [Modal](../modal/README.md) - Centered dialog overlay
- [Base UI Dialog](https://base-ui.com/react/components/dialog) - Underlying primitive
