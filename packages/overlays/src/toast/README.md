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
- **`useToastManager`** — called anywhere below the provider; `add()` pushes a toast, `update()` changes one in place, `close()` dismisses one, `promise()` follows a promise from loading to settled, and `toasts` reads the active list

```tsx
<ToastProvider>
  <App />
  <Toaster position="bottom" />
</ToastProvider>
```

`ToastProvider` takes Base UI's provider props: `timeout` (5000ms by default) and `limit` (3 visible toasts by default).

### Outside React

To fire toasts from code that can't call a hook — an API client, a module-level helper — make a manager with `createToastManager` and hand it to the provider. It has `add()`, `update()`, `close()`, and `promise()`; `toasts` is still read through `useToastManager`.

```tsx
export const toastManager = createToastManager();

<ToastProvider toastManager={toastManager}>
  <App />
  <Toaster />
</ToastProvider>;
```

A manager does nothing until a `ToastProvider` subscribes to it, so a toast added before the provider mounts is dropped.

## What a toast renders

Base UI's [Toast](https://base-ui.com/react/components/toast) is the underlying primitive, and its options pass through `add()` and `update()` unchanged. Toaster renders these fields:

- **`title`** and **`description`** — either can stand alone; they label and describe the toast for assistive tech
- **`type`** — any string, exposed as `data-type`. `loading` shows a spinner and hides the close button; Base UI's `promise()` sets `loading`, `success`, and `error` for you
- **`actionProps`** — renders a button; its `children` is the label
- **`timeout`** — milliseconds until the toast closes itself, the provider's default when left out; `0` keeps it open. A `loading` toast never times out, and its timer starts once `update()` changes its type. Leave `timeout` off a `loading` toast: it carries over into the update, so a `0` there leaves the settled toast open for good

Three more live on `data`, because Base UI has no field for them:

- **`data.children`** — rendered below the text, for content like a `Progress` bar. Pass a new node through `update()` to change it
- **`data.color`** — a palette hue for the surface. No type maps to a hue on its own; the app decides what an error looks like
- **`data.closable`** — show the close button. Defaults to `true`, except on `loading` toasts

```tsx
const toastManager = useToastManager();

const id = toastManager.add({
  title: "Syncing",
  type: "loading",
  data: { children: <Progress value={null} /> },
});

toastManager.update(id, {
  title: "Sync complete",
  type: "success",
  data: { color: "green" },
});
```

## Custom layouts

`Toaster` is built from exported parts, each a Base UI part under its own name: `ToastPortal`, `ToastViewport`, `ToastRoot`, `ToastContent`, `ToastTitle`, `ToastDescription`, `ToastAction`, and `ToastClose`. Compose them when the default layout doesn't fit. Keep the body inside `ToastContent` — collapsed toasts take the frontmost toast's height, and `ToastContent` fades out the body of any toast stacked behind it.

`Toaster` points each toast's `swipeDirection` at the edge its stack is anchored to; a custom layout passes its own, or gets Base UI's `down` and `right`.

## Gotchas

- **The close button is hidden from assistive tech until the stack is expanded or focused**, as in Base UI, so a collapsed stack doesn't announce one close button per toast.
- **`update()` replaces `data` whole.** It merges a toast's top-level fields, not the keys inside `data`, so `update(id, { data: { children } })` drops the toast's `color` and `closable`. Pass every `data` field the toast should keep; `data: {}` clears them all.
- **`update()` does nothing once a toast is closing or closed**, so the result of slow work is lost if the user swiped its toast away first — when the outcome must be seen, check `toasts` for the id and `add()` a new toast instead.
