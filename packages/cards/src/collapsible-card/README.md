# CollapsibleCard

> A `Card` whose body folds away behind a chevron in its title. Closed, only the header shows.

Use CollapsibleCard when you want to:

- Let people hide a card's body and footer, keeping its header (title, description, action) in view
- Stack several optional or secondary sections on a page without them all taking full height
- Drive the open state from elsewhere with `open` + `onOpenChange`, or let the card own it with `defaultOpen`

It takes every `Card` prop — `description`, `action`, `footer`, `thumbnail`, `color`, `variant`, the slot overrides — and adds the collapsible ones:

| Prop           | Purpose                                                                     |
| -------------- | --------------------------------------------------------------------------- |
| `title`        | Required. What a closed card still shows, and the chevron's accessible name |
| `defaultOpen`  | Starts open when uncontrolled. Defaults to closed                           |
| `open`         | Controlled open state                                                       |
| `onOpenChange` | Called with the next open state and Base UI's event details                 |
| `disabled`     | Keeps the chevron focusable but inert                                       |

The chevron is built in: a ghost `xsmall` square `Button` leading the title, pointing right while closed and turning down once open. It sits beside the title rather than inside it, so the title text alone is the card's `<h3>`, sized from `TitleProps`. It is the only trigger, so the rest of the header — including an `action` — stays independently clickable.

While closed, the body and `footer` unmount, taking their container gap with them, so the card shrinks to its header. The open state also lands on the card container as `data-open` / `data-closed`, should a surface need to style either state.

Built on Base UI's [Collapsible](https://base-ui.com/react/components/collapsible): the card container is its root, the inner container its panel, and the chevron its trigger, so `aria-expanded` and `aria-controls` are wired for you. `InnerContainerProps` still forwards to the body, except `render`, which the panel owns. `TitleProps` styles the title (`size`, `shade`, `render`, …) but takes no `children`: the title's content only comes from `title`.

For disclosure that isn't a card — a single expandable row — reach for `Collapsible` from `@uiid/interactive`, or `Accordion` from `@uiid/navigation` for a group of them.
