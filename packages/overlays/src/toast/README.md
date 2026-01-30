# Toaster

> Container for toast notifications

## Quick Reference

```tsx
import { ToastProvider, Toaster, useToastManager } from "@uiid/overlays";

// Wrap your app
<ToastProvider>
  <App />
  <Toaster />
</ToastProvider>

// Trigger toasts anywhere
const toastManager = useToastManager();
toastManager.add({ description: "Changes saved!" });
```

## Examples

### Setup

```tsx
// In your app root
import { ToastProvider, Toaster } from "@uiid/overlays";

function App() {
  return (
    <ToastProvider>
      <MainContent />
      <Toaster position="bottom" />
    </ToastProvider>
  );
}
```

### Triggering Toasts

```tsx
import { useToastManager } from "@uiid/overlays";

function SaveButton() {
  const toastManager = useToastManager();

  const handleSave = async () => {
    await saveData();
    toastManager.add({ description: "Changes saved successfully!" });
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### Position

```tsx
// Bottom of screen (default)
<Toaster position="bottom" />

// Top of screen
<Toaster position="top" />
```

### Multiple Toasts

```tsx
const toastManager = useToastManager();

// Each call adds a new toast
toastManager.add({ description: "First notification" });
toastManager.add({ description: "Second notification" });
```

## Exports

| Export | Type | Description |
|--------|------|-------------|
| `ToastProvider` | `Component` | Context provider (wrap your app) |
| `Toaster` | `Component` | Toast viewport (place once in app) |
| `useToastManager` | `Hook` | Hook to trigger and manage toasts |

## Toaster Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `"top" \| "bottom"` | `"bottom"` | — |

## useToastManager API

```tsx
const toastManager = useToastManager();

// Add a toast
toastManager.add({
  description: "Message text",
  // Additional Base UI toast options...
});

// Access current toasts
toastManager.toasts; // Array of active toasts
```

## Data Slots

| Slot | Element |
|------|---------|
| `toast` | Individual toast container |

## Accessibility

- Toasts are announced to screen readers
- Non-intrusive notifications that auto-dismiss
- Viewport is positioned for visibility

## See Also

- [Base UI Toast](https://base-ui.com/react/components/toast) - Underlying primitive
