# Spec: docs-adoption — V1

Milestone 2. Depends on `code-preview`. Inherits the shared conventions in `spec/capability-map-code.md`.

## Objective

Every component example on the docs site renders through `CodePreview`, so the site shows the polished unit and proves the component on about 110 pages of real use.

## Current behavior this spec changes

`apps/docs/components/docs/example.tsx` is an async server component. It reads a named export's source from the component's `*.examples.tsx`, renders `children` in a bordered canvas, and renders a separate `HighlightedCodeBlock` beneath it capped at 8 rows, with the example's title as the filename.

## Requirements

1. `Example` keeps its props (`title`, `of`, `name`, `children`) and gains `resettable`. No MDX page has to change to keep working.
2. `Example` highlights on the server and passes `code` and `html` to `CodePreview`. Docs pages ship no Shiki to the client, as today.
3. The example's `id` (from `slugify(title)`) and `data-title` stay on the outer element, so anchors and the on-this-page list keep working.
4. The title renders as a heading above the frame in every case, not as a filename inside the code.
5. An `Example` with no `of` and `name` renders the framed canvas alone.
6. Every example that animates on load gets `resettable` in its MDX. The plan produces the list by reading the examples; the owner confirms it.
7. `HighlightedCodeBlock` stays for README code fences, which pick up the hardened `CodeBlock` with no change.
8. The source extraction in `getExampleSource` is not changed.

## Testing strategy

- `pnpm run build --filter=docs` builds every page.
- A docs-side test or script asserts that a built example page's client bundle contains no Shiki chunk.
- Manual check in a real browser, at desktop and 320px widths, of one page each from buttons, forms, overlays and typography, plus every `resettable` example.

## Boundaries

Deltas only.

- **Ask first:** adding the `preview` label to a PR; changing any MDX page beyond adding `resettable`.
- **Never:** use the Vercel connector on account data. Docs builds are checked locally.

## Success criteria

- [ ] The docs build passes.
- [ ] No page has horizontal scroll at 320px on the four spot-checked pages.
- [ ] Anchors to examples resolve to the same `id`s as before; the set of ids on one sampled page is unchanged.
- [ ] Each `resettable` example visibly replays on reset.
- [ ] The owner has browsed the site and accepted it.

## Out of scope (deferred)

- Showing the full examples file, imports included, or more than one file per example.
- Package-manager install tabs: milestone 4.
- Redesigning docs page layout around the new frame.

## Open questions

1. **Title placement (requirement 4).** Today a titled example with code shows the title only as the code's filename. A heading above the frame is clearer and makes the anchor target visible. Confirm, or keep the title inside the frame's bar.
