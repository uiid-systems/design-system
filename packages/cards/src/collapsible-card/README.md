# CollapsibleCard

> A `Card` whose body folds away behind a chevron in its title. Closed, only the header and footer show.

Use CollapsibleCard when you want to:

- Let people hide a card's body, keeping its header (title, description, action) and footer in view
- Stack several optional or secondary sections on a page without them all taking full height
- Drive the open state from elsewhere with `open` + `onOpenChange`, or let the card own it with `defaultOpen`

It takes every `Card` prop — `description`, `action`, `footer`, `thumbnail`, `color`, `variant`, the slot overrides — and adds the collapsible ones:

| Prop              | Purpose                                                                     |
| ----------------- | --------------------------------------------------------------------------- |
| `title`           | Required. What a closed card still shows, and the chevron's accessible name |
| `defaultOpen`     | Starts open when uncontrolled. Defaults to closed                           |
| `open`            | Controlled open state                                                       |
| `onOpenChange`    | Called with the next open state and Base UI's event details                 |
| `disabled`        | Keeps the chevron focusable but inert, dims the card, makes `action` inert  |
| `keepMounted`     | Hides the closed body instead of unmounting it, so its state survives       |
| `clickableHeader` | The whole header toggles the card, not just the chevron                     |

The chevron is built in: a ghost `xsmall` square `Button` leading the title, pointing right while closed and turning down once open. It takes the card's `color`, so its icon and hover match the card. It sits beside the title rather than inside it, so the title text alone is the card's `<h3>`, sized from `TitleProps`. It is the only trigger, so by default the rest of the header — including an `action` — stays independently clickable.

With `clickableHeader`, the chevron's hit area stretches over the whole header: clicking the title, the description, empty space or a non-interactive `action` (a badge, a status dot) toggles the card, and hovering anywhere in the header shows the chevron's hover and a pointer. The chevron stays the only trigger, so keyboard focus, the focus ring and what assistive technology announces don't change. Buttons, links and inputs anywhere in the header sit above the stretch and keep their own click.

`disabled` dims the whole card and makes the `action` slot `inert`, so nothing in it can be clicked or focused. The card can't disable each control a caller puts in `action`, so it takes the whole slot out of reach instead.

While closed, the body unmounts, taking its container gap with it, so the card shrinks to its header and `footer`. With `keepMounted`, the body is hidden instead, so its state — a form's inputs, say — survives collapsing. The open state also lands on the card container as `data-open` / `data-closed`, should a surface need to style either state.

Built on Base UI's [Collapsible](https://base-ui.com/react/components/collapsible): the card container is its root, the inner container its panel, and the chevron its trigger, so `aria-expanded` and `aria-controls` are wired for you. `InnerContainerProps` still forwards to the body, except `render`, which the panel owns. `TitleProps` goes to the title row — the chevron and the `<h3>` — and takes no `children`: the title's content only comes from `title`. `size` and `weight` also size the `<h3>`, and `shade` reaches it by inheritance. `render` swaps the row's element but keeps the chevron and `<h3>` inside it, so don't render a heading there.

For disclosure that isn't a card — a single expandable row — reach for `Collapsible` from `@uiid/interactive`, or `Accordion` from `@uiid/navigation` for a group of them.

## Gotchas

- **`clickableHeader` makes header text unselectable.** A press on the title or description lands on the chevron, so the text can't be drag-selected or copied. Leave it off where people copy from the header.
- **With `clickableHeader`, a click on a disabled control in `action` toggles the card.** A disabled control turns off its own pointer events, so the click falls through to the stretched chevron.
- **`inert` also hides a disabled card's `action` from assistive technology.** A badge or status in `action` goes unannounced while the card is disabled; anything that must stay announced belongs in the title or description.
- **Don't dim a disabled card's `action` yourself.** The whole card already dims, so your own opacity compounds with it.
- **The `footer` doesn't collapse.** Content that should fold away with the body, like a step's navigation, goes at the end of `children` instead.
