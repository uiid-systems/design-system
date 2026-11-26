# Spec: code-inline — V1

Milestone 1. Inherits the shared conventions in `spec/capability-map-code.md`.

## Objective

`CodeInline` is small and mostly right. This module closes the gaps that show up in real prose: overflow on narrow screens, a possible shift when highlighting lands, and fragile handling of Shiki's output.

## Current behavior this spec changes

- `white-space: nowrap` means a long inline snippet cannot break and pushes the page wider on a phone.
- The highlighted markup is produced by stripping `<pre><code>` from Shiki's HTML with two regular expressions.
- With a `language` and non-string children, the component highlights an empty string and can drop the children.

## Requirements

1. Inline code never causes horizontal page scroll. A snippet longer than its line breaks at sensible points; a short one stays on one line.
2. Plain, pending and highlighted states have the same box: same width, height and baseline. Highlighting changes colors only.
3. With a `language` and children that are not a string, the children render as given, unhighlighted.
4. The inner markup is taken from Shiki's output in a way that does not depend on the exact shape of the wrapper tags. If the expected structure is missing, the plain children render.
5. Server `html` shows colors on first paint and loads no highlighter on the client.
6. Theme behavior matches `code-block` requirement 19.
7. Inline code inside a link, a heading and a table cell inherits what it should (link underline and color stay visible, heading size scales it) and keeps its own surface and radius.

## Testing strategy

- Unit tests cover 3, 4 and 5.
- `code-inline.browser.test.tsx` covers 1, 2, 6 and 7 by measuring boxes in a 320px container and inside `Prose`.
- Stories: in a paragraph, long snippet in a narrow column, in a heading, in a link, in a table, both themes.

## Success criteria

- [ ] A 120-character inline snippet in a 320px container leaves `document.documentElement.scrollWidth` equal to the viewport width.
- [ ] The measured box of a highlighted snippet equals its plain box.
- [ ] `<CodeInline language="ts"><b>x</b></CodeInline>` renders the `<b>`.
- [ ] Browser and unit tests pass.

## Out of scope (deferred)

- A copy affordance on inline code.
- Size or color variants.

## Open questions

None.
