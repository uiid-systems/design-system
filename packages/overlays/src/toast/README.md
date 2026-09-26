# Toaster

> The viewport for transient notifications. Unlike the other overlays there is no trigger — toasts are added imperatively from anywhere in the tree.

Use Toaster when you want to:

- Confirm something happened after the fact — saved, copied, deleted — without interrupting what the user is doing
- Report on work that takes a while: a `loading` toast that turns into a success or an error when it settles
- Fire a notification from outside the render tree of whatever displays it

Toast is not a dialog. It holds nothing the user must act on. If a message needs a decision, use `Dialog`.

## Three pieces

Unlike the other overlays, Toaster is not one component — it's a provider, a viewport, and a hook, and all three have to be present:

- **`ToastProvider`** — wraps the app once, holds the queue
- **`Toaster`** — rendered once inside the provider; this is the viewport the toasts appear in
- **`useToastManager`** — called anywhere below the provider; `add()` pushes a toast, `update()` changes one in place, `close()` dismisses one, and `toasts` reads the active list

```tsx
<ToastProvider>
  <App />
  <Toaster position="bottom" />
</ToastProvider>
```

## What a toast renders

Base UI's [Toast](https://base-ui.com/react/components/toast) is the underlying primitive, and its options pass through `add()` and `update()` unchanged. Toaster renders these fields:

- **`title`** and **`description`** — either can stand alone; they label and describe the toast for assistive tech
- **`type`** — any string, exposed as `data-type`. `loading` shows a spinner and hides the close button; Base UI's `promise()` sets `loading`, `success`, and `error` for you
- **`actionProps`** — renders a button; its `children` is the label
- **`timeout`** — `0` keeps the toast open until it's updated or closed, which a `loading` toast needs

Three more live on `data`, because Base UI has no field for them:

- **`data.children`** — rendered below the text, for content like a `Progress` bar. Pass a new node through `update()` to change it
- **`data.color`** — a palette hue for the surface. No type maps to a hue on its own; the app decides what an error looks like
- **`data.closable`** — show the close button. Defaults to `true`, except on `loading` toasts

```tsx
const toastManager = useToastManager();

const id = toastManager.add({
  title: "Syncing",
  type: "loading",
  timeout: 0,
  data: { children: <Progress value={null} /> },
});

toastManager.update(id, {
  title: "Sync complete",
  type: "success",
  timeout: 5000,
  data: { color: "green" },
});
```

## Custom layouts

`Toaster` is built from exported parts, each a Base UI part under its own name: `ToastPortal`, `ToastViewport`, `ToastRoot`, `ToastContent`, `ToastTitle`, `ToastDescription`, `ToastAction`, and `ToastClose`. Compose them when the default layout doesn't fit. Keep the body inside `ToastContent` — collapsed toasts take the frontmost toast's height, and `ToastContent` fades out the body of any toast stacked behind it.
