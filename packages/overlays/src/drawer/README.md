# Drawer

> Edge-anchored panel with swipe-to-dismiss and snap points. Title, description, icon, action, and footer are slot props; the children prop fills the body.

Use Drawer when you want to:

- Anchor a panel to any edge of the viewport — `swipeDirection` sets both the edge it enters from and the direction a swipe dismisses it (`up`, `down`, `left`, `right`; defaults to `down`)
- Let touch users drag the panel away instead of hunting for a close button
- Build a bottom sheet that rests partway open — pass `snapPoints` as viewport fractions (`0.3`), pixel values (`400`), or CSS lengths (`"30rem"`)
- Keep the page interactive behind the panel with `modal={false}`, or trap focus without locking scroll with `modal="trap-focus"`
- Compose the header from any combination of `icon`, `title`, `description`, and `action`, with a `footer` below the body — the same content API as [Dialog](../dialog/README.md) and [Popover](../popover/README.md), because the popup renders as a `Card`

Drawer wraps Base UI's `Drawer` primitive and takes its props unchanged. Anything
not listed here is forwarded — reach for the Base UI documentation first.

## Quick Reference

```tsx
import { Drawer } from "@uiid/overlays";

<Drawer trigger={<Button>Open</Button>} title="Settings">
  Panel content
</Drawer>;
```

## Examples

### Anchoring to an edge

```tsx
<Drawer swipeDirection="left" trigger={<Button>Navigation</Button>}>
  <Nav />
</Drawer>
```

### Bottom sheet with snap points

```tsx
<Drawer
  swipeDirection="down"
  snapPoints={[0.3, 0.6, 1]}
  trigger={<Button>Details</Button>}
>
  <Details />
</Drawer>
```

### Controlled

```tsx
const [open, setOpen] = useState(false);

<Drawer open={open} onOpenChange={setOpen} title="Filters">
  <Filters />
</Drawer>;
```

### Non-modal

```tsx
// The page stays scrollable and clickable behind the drawer.
<Drawer modal={false} trigger={<Button>Inspector</Button>}>
  <Inspector />
</Drawer>
```

### Indent effect

Opt in by wrapping the app. Every `Drawer` inside the provider scales the
background down while it is open.

```tsx
<DrawerProvider>
  <DrawerIndentBackground />
  <DrawerIndent>
    <App />
  </DrawerIndent>
</DrawerProvider>
```

## Anatomy

```tsx
<DrawerRoot>
  <DrawerTrigger>{trigger}</DrawerTrigger>
  <DrawerPortal>
    <DrawerBackdrop />
    <DrawerViewport>
      <DrawerPopup>
        <DrawerContent>{children}</DrawerContent>
      </DrawerPopup>
    </DrawerViewport>
  </DrawerPortal>
</DrawerRoot>
```

`DrawerViewport` positions the popup, so the popup's own `transform` is free for
the gesture system. `DrawerContent` lets a mouse user select text in the body
without the drag turning into a swipe.

## Data Slots

| Slot | Element |
| --- | --- |
| `drawer-trigger` | Trigger |
| `drawer-portal` | Portal |
| `drawer-backdrop` | Backdrop overlay |
| `drawer-viewport` | Positioning container |
| `drawer-popup` | Panel surface (a `Card`) |
| `drawer-content` | Body wrapper |
| `drawer-close` | Close control |
| `drawer-indent` / `drawer-indent-background` | Opt-in indent effect |

## Styling

Base UI reports drag state through CSS variables that `drawer.module.css`
consumes — `--drawer-swipe-movement-x` / `-y`, `--drawer-snap-point-offset`,
`--drawer-swipe-progress`, and `--drawer-swipe-strength`. Edge placement keys off
the `data-swipe-direction` attribute the popup carries, so there is no variant
class to override.

## Accessibility

- Has `role="dialog"`; `aria-labelledby` and `aria-describedby` are wired from the
  `title` and `description` slots
- Focus is trapped while `modal` is truthy, and returns to the trigger on close
- Closes with `Escape`, a backdrop press, or a swipe toward the anchored edge

## Caveats

- Built on Base UI's `DrawerPreview` namespace — a preview API.
  `@base-ui/react` is pinned exactly, so treat any version bump as a review point.
- `Drawer.SwipeArea` (swipe from the edge to *open*) is documented upstream but
  is **not exported** in `@base-ui/react@1.2.0`, so it isn't surfaced here yet.

## See Also

- [Dialog](../dialog/README.md) - Centered dialog overlay
- [Popover](../popover/README.md) - Positioned popup anchored to a trigger
- [Base UI Drawer](https://base-ui.com/react/components/drawer) - Underlying primitive
