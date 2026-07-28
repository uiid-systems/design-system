# Toaster

> The viewport for transient notifications. Unlike the other overlays there is no trigger — toasts are added imperatively from anywhere in the tree.

Use Toaster when you want to:

- Confirm something happened after the fact — saved, copied, deleted — without interrupting what the user is doing
- Fire a notification from outside the render tree of whatever displays it
- Anchor the stack to the `top` or `bottom` of the screen with `position`

Toast is not a dialog. It dismisses itself and holds nothing the user must act
on. If a message needs a decision, use `Dialog`.

## Three pieces

Unlike the other overlays, Toaster is not one component — it's a provider, a
viewport, and a hook, and all three have to be present:

- **`ToastProvider`** — wraps the app once, holds the queue
- **`Toaster`** — rendered once inside the provider; this is the viewport the toasts appear in
- **`useToastManager`** — called anywhere below the provider; `add({ description })` pushes a toast, and `toasts` reads the active list

```tsx
<ToastProvider>
  <App />
  <Toaster position="bottom" />
</ToastProvider>
```

Each toast renders as a `Card`, so it inherits the surface treatment of the
other overlays. Base UI's
[Toast](https://base-ui.com/react/components/toast) is the underlying primitive
and its options pass through `add`.
