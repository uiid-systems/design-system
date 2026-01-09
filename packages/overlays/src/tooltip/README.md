# Tooltip

> A popup that displays information on hover or focus. Built on [Base UI Tooltip](https://base-ui.com/react/components/tooltip).

## Quick Reference

```tsx
import { Tooltip } from "@uiid/overlays";

// Basic usage
<Tooltip trigger={<button>Hover me</button>}>
  Helpful information
</Tooltip>
```

## Examples

### Basic

```tsx
<Tooltip trigger={<button>Hover me</button>}>
  This is a tooltip
</Tooltip>
```

### With Icon Button

```tsx
<Tooltip trigger={<Button square aria-label="Help"><HelpIcon /></Button>}>
  Click for more information
</Tooltip>
```

### Custom Positioning

```tsx
<Tooltip
  trigger={<button>Hover</button>}
  PositionerProps={{ side: "bottom", sideOffset: 12 }}
>
  Positioned below
</Tooltip>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `trigger` | `ReactNode` | — | Element that triggers the tooltip |
| `children` | `ReactNode` | — | Tooltip content |
| `ProviderProps` | `TooltipProviderProps` | — | Props for TooltipProvider |
| `RootProps` | `TooltipRootProps` | — | Props for TooltipRoot |
| `TriggerProps` | `TooltipTriggerProps` | — | Props for trigger wrapper |
| `PortalProps` | `TooltipPortalProps` | — | Props for portal |
| `PositionerProps` | `TooltipPositionerProps` | `{ sideOffset: 8, collisionPadding: 16 }` | Positioning options |
| `PopupProps` | `TooltipPopupProps` | — | Props for popup element |

## Anatomy

```tsx
<TooltipProvider>
  <TooltipRoot>
    <TooltipTrigger>{trigger}</TooltipTrigger>
    <TooltipPortal>
      <TooltipPositioner>
        <TooltipPopup>{children}</TooltipPopup>
      </TooltipPositioner>
    </TooltipPortal>
  </TooltipRoot>
</TooltipProvider>
```

## Data Slots

| Slot | Element |
|------|---------|
| `tooltip-popup` | Popup container |

## Accessibility

- Shows on hover and focus
- Hides on `Escape` key
- Associates with trigger via `aria-describedby`
- Respects `prefers-reduced-motion`

## See Also

- [Popover](../popover/README.md) - Click-triggered popup with more content
- [Base UI Tooltip](https://base-ui.com/react/components/tooltip) - Underlying primitive
