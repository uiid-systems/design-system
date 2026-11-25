# Avatar

> A square that stands for a person or an account: their initials, or their picture once it loads. A name and a description can sit beside it.

Use Avatar when you want to:

- Show who something belongs to with `initials`, which are required and always render until an image replaces them
- Show a picture with `src` — it replaces the initials once it has loaded, and the initials stay if it is missing or fails
- Put a `name`, and a `description` under it, beside the avatar
- Stack the name under the avatar with `orientation="vertical"`; the default is `horizontal`
- Tint the square with a palette `color` (`red`, `blue`, …), the same treatment a [Badge](../badge/README.md) gets

The image is built on Base UI's [Avatar](https://base-ui.com/react/components/avatar): `AvatarLayers` renders `Avatar.Root`, which tracks whether the image has loaded, `AvatarImage` is `Avatar.Image`, mounted only once it has, and `AvatarInitials` is `Avatar.Fallback`, shown until then. Pass `delay` through `InitialsProps` to hold the initials back for a fast-loading image, and `onLoadingStatusChange` through `ImageProps` to follow the load:

```tsx
<Avatar initials="AF" src={src} InitialsProps={{ delay: 300 }} />
```

The image's `alt` is the initials when Avatar stands alone. When a `name` renders beside it the `alt` is empty, since the name already says who it is. Pass `ImageProps={{ alt }}` to name it yourself.

The root renders a `Group` when horizontal and a `Stack` when vertical, so it takes layout props (`gap`, `p`, …). `className`, `ref` and remaining props reach the root. Slot overrides (`ImageProps`, `InitialsProps`, `NameProps`, `DescriptionProps`) reach each part, except what Avatar sets itself: `ImageProps` takes no `src`, and `InitialsProps`, `NameProps` and `DescriptionProps` take neither their part's text (`initials`, `name`, `description`) nor `children`. The container has no slot: its props are passed at the top level.

`AvatarContainer`, `AvatarLayers`, `AvatarImage`, `AvatarInitials`, `AvatarName` and `AvatarDescription` are exported for composition. `AvatarImage` and `AvatarInitials` must sit inside `AvatarLayers`, which holds the loading status they read.

The square is `--avatar-size-md` (2.5rem) tall and at least as wide.
