# Tooltip

> Informational popup shown on hover or focus

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
| `trigger` | `ReactNode` | — | — |
| `delay` | `number` | — | — |
| `onOpenChange` | `(...args: any[]) => any` | — | — |
| `open` | `boolean` | — | — |
| `PopupProps` | `any` | — | — |
| `PortalProps` | `any` | — | — |
| `PositionerProps` | `any` | — | — |
| `ProviderProps` | `any` | — | — |
| `RootProps` | `any` | — | — |
| `TriggerProps` | `any` | — | — |

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
