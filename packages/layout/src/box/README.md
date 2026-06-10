# Box

> Foundational layout primitive — a polymorphic div with prop-based layout, spacing, sizing, and border control.

Most teams should reach for [`Stack`](../stack/README.md) or [`Group`](../group/README.md) instead. Box is what they're built on.

Use Box directly when:

- You need full flex control without an opinion about direction
- You need to render as a non-div semantic element (`<section>`, `<form>`, etc.) via the `render` prop
- You're composing a new layout primitive
