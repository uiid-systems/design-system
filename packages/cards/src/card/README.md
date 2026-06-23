# Card

> Container card. Title, description, icon, action, footer, and thumbnail are slot props; the children prop fills the body.

Use Card when you want to:

- Group related content behind a single surface with consistent padding, border, and shadow
- Compose a header from any combination of `icon`, `title`, `description`, and `action` — pass only the props you need
- Add a flush `thumbnail` above the header (image, illustration, chart)
- Place a `footer` separated by a divider — typically a row of actions
- Strip the chrome for inline placements — remove the padding with `p={0}` and the border with `b={0}` (style the background directly if you need it transparent)
- Render as a different element (`<a>`, `<article>`, `<button>`) via the `render` prop — links and buttons gain a scale-on-hover affordance automatically

Slot overrides (`HeaderProps`, `TitleProps`, `DescriptionProps`, `IconProps`, `ActionProps`, `FooterProps`, `ThumbnailProps`, `InnerContainerProps`) forward props through to the subcomponent when the slot prop isn't expressive enough.
