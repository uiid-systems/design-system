# Card

> Container card. Title, description, action, footer, and thumbnail are slot props; the children prop fills the body.

Use Card when you want to:

- Group related content behind a single surface with consistent padding and border
- Lift the card off the page with `shadow`. Cards are flat by default; Dialog, Drawer, Popover, Tooltip and the Select and Combobox popups set it for their floating surfaces
- Compose a header from any combination of `title`, `description`, and `action` — pass only the props you need
- Add a flush `thumbnail` above the header (image, illustration, chart)
- Place a `footer` below the body — typically a row of actions. No divider by default; opt in with `FooterProps={{ hideSeparator: false }}`. Dialog, Drawer and Popover turn it on for their footers
- Strip the chrome for inline placements — remove the padding with `p={0}` and the border with `b={0}` (style the background directly if you need it transparent)
- Fill the height left in its parent with `grow`: the card takes the parent's leftover space and the body takes what's left under the header, so a full-height page body (a split view, a document viewer) needs no `calc(100dvh - …)`. The parent has to bound its height. `InnerContainerProps={{ grow: false }}` keeps the body at its content height
- Fill a page's main content area with `variant="shell"`: the header is the page header (title, description, actions) and `children` is the page body. It's `w="full"` (pass another `w` to size it yourself), pads at `p={6}`, has no border, radius or shadow, and stays transparent until you pass `color`. A plain-text title renders as an `<h2>` at `size={4}` `weight="medium"`, the description sits 3 units below it (half the shell's gap), and the title and description each cap at 720px. It spaces the header from the body, and the body's children from each other, at `gap={6}`; `p` and `gap` override the container, `InnerContainerProps={{ gap }}` the body. Breadcrumbs and the sidebar sit outside the shell. See the `Shell` example
- Render as a different element (`<a>`, `<article>`, `<button>`) via the `render` prop — links and buttons gain a scale-on-hover affordance automatically

Slot overrides (`HeaderProps`, `TitleProps`, `DescriptionProps`, `ActionProps`, `FooterProps`, `ThumbnailProps`, `InnerContainerProps`) forward props through to the subcomponent when the slot prop isn't expressive enough.

A plain-text `title` renders as an `<h3>`. A title with elements in it, such as an icon or badge beside the text, renders as a `div` row at `gap={2}`, centred vertically. Pass the pieces as a fragment rather than wrapping them in your own `Group`. That row is not a heading, so when a composed title should be one, wrap its text in `<Text render={<h3 />} size={1} weight="semibold">`. `TitleProps.render` overrides the element in either case.

A shell's plain-text title is an `<h2>` because the page's `<h1>` belongs to the page chrome outside it. Override with `TitleProps={{ render: <h1 /> }}` (or `<h3 />` for a nested sub-page shell); a `size` or `weight` in `TitleProps` overrides the page-heading ramp the same way.

## Padding

`p`, `px`, `py`, `pl`, `pr`, `pt` and `pb` work as on any layout primitive, on the root or through `ContainerProps`. Each side takes the first source that sets it: `ContainerProps`, then the root's props, then the shell's `p={6}`. An `undefined` value falls through to the next source rather than clearing the side. Card writes the resolved sides as `pt`, `pb`, `pl` and `pr`, so `p` paints through `--spacing-block` and `--spacing-inline` per side rather than `--spacing-unit`. All three are equal by default.

The card publishes its inline padding as `--card-padding-inline-start` and `--card-padding-inline-end`, so a child can reach the card's edge without re-deriving the padding. A full-bleed rule, for example, sets `margin-inline: calc(-1 * var(--card-padding-inline-start)) calc(-1 * var(--card-padding-inline-end))`. Padding set through a `className` instead of the props isn't reflected in them.
