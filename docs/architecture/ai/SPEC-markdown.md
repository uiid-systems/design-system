# Spec: `markdown`

**Module:** `markdown` (see [capability map](./capability-map.md))
**Package:** `@uiid/ai`
**Status:** Draft
**Upstream:** `ai-elements/packages/elements/src/message.tsx` (`MessageResponse`, a thin wrapper over `streamdown`, which repairs with `remend`). The `response.tsx` the Linear issue links to does not exist at `ca8be60`; it was folded into `message.tsx`.
**Depends on:** `ai-scaffold`

## Objective

`Markdown` renders a markdown string as plain HTML elements inside `Prose`, and keeps rendering cleanly when that string is cut off anywhere: mid-word, mid-emphasis, mid-link, mid-fence. It is the renderer behind `MessageResponse`, `Reasoning` and `Tool` output, all of which receive text token by token.

Parsing is `markdown-to-jsx`, imported from its `markdown-to-jsx/react` entry. Streaming repair is a small local pre-pass, `repairMarkdown`, that closes or removes unfinished inline syntax at the tail of the text before the parser sees it. All styling comes from `Prose`. This module adds no CSS.

**Acceptance criteria:**

- `<Markdown>{source}</Markdown>` with a complete document renders headings, paragraphs, lists, links, emphasis, inline code and fenced code as the usual elements, directly inside a `Prose` root with `data-slot="markdown"`.
- Block elements are direct children of that root. There is no wrapper `div` between `Prose` and the blocks, so `Prose`'s sibling rhythm applies.
- A one-line string renders as a `<p>`, not as bare inline text.
- Every `Prose` prop passes through: spacing props, `render`, `className`, `style`, `ref` and DOM attributes.
- A string cut mid-emphasis, mid-code-span, mid-strikethrough, mid-link, mid-image or mid-fence renders without throwing, and its text content contains none of the raw delimiters `**`, `*`, `_`, `` ` ``, `~~`, `[`, `](`.
- A string cut mid-fence renders the open fence as a code block that grows as tokens land.
- `javascript:` hrefs and inline event handlers never reach the DOM. This is `markdown-to-jsx`'s built-in sanitizer, which is always on and is covered by a test so a future option change cannot silently turn it off.
- It renders on the server: no `"use client"`, no hooks, no state.
- `grep -r '"ai"' packages/ai/dist` still returns nothing.
- `pnpm size` passes with the existing `40 kB` entry for `@uiid/ai`.

## API

```ts
import type { ProseProps } from "@uiid/typography";

export type MarkdownProps = Omit<ProseProps, "children"> & {
  /** Markdown source. It may be cut off anywhere while it streams. */
  children: string;
};
```

There are no other props. Upstream's `parseIncompleteMarkdown` toggle is dropped: `repairMarkdown` returns well-formed markdown unchanged, so there is nothing to opt out of. `overrides` and other parser options are not exposed (see Boundaries).

## Implementation notes

### Component

```tsx
import { compiler } from "markdown-to-jsx/react";
import { Prose } from "@uiid/typography";

import type { MarkdownProps } from "./markdown.types";
import { repairMarkdown } from "./markdown.utils";

export const Markdown = ({ children, ...props }: MarkdownProps) => (
  <Prose data-slot="markdown" {...props}>
    {compiler(repairMarkdown(children), { wrapper: null, forceBlock: true })}
  </Prose>
);
```

- `wrapper: null` makes the compiler return its children without a wrapper element, which is what keeps the blocks as direct children of `Prose`. With one block it returns that element; with several it returns a keyed array.
- `forceBlock: true` makes a single line render as `<p>` instead of inline text, so `Prose`'s `& > p` rules apply to the shortest message.
- `data-slot="markdown"` is written inline in JSX, where hyphenated attributes are exempt from excess-property checks. `prepareComponentProps` spreads the caller's props after its own `data-slot`, so it wins over `Prose`'s `prose`.
- Every other option stays at its default. Raw HTML is parsed, with the library's always-on attribute sanitizer and the default `tagfilter`, which escapes `script`, `iframe`, `style` and kin. A tag cut off mid-attribute (`<div class="x`) is escaped as text by the parser, so the pre-pass does nothing for HTML.
- No `memo`, no `useMemo`. The compile is linear in the text and runs once per render. `ai-message` memoizes `MessageResponse` on `children` the way upstream does, which is the right level for it.
- Headings get an `id` from the library's slugifier. A transcript with many messages may therefore repeat ids. Left alone for the POC; revisit if it shows up in an accessibility check.

### `repairMarkdown`

A pure function in `markdown.utils.ts`, `(markdown: string) => string`, with no dependencies. It scans left to right, tracks what is open, and fixes only what is still open when the text ends. It never touches anything that is already closed.

**Scope rules:**

- Fenced code is a boundary. Lines opening with ` ``` ` or `~~~` toggle fence state; nothing inside a fence is a delimiter. If the text ends inside an open fence, it is returned unchanged, because the parser already renders an open fence as a code block.
- Inline state resets at every blank line, so an unmatched `*` in an earlier paragraph is left to the parser (which renders it literally) instead of pulling a closer onto the end of the text.
- Code spans take precedence: between an opening backtick run and its match, nothing is a delimiter. An unclosed code span is closed with its own run.
- A backslash escapes the next character.
- Openers follow CommonMark's flanking rules in simplified form: a run opens only if the next character is not whitespace. `_` and `__` also require the previous character to be whitespace, punctuation or the start of the line, so `snake_case_name` never opens emphasis. `5 * 3` stays arithmetic.
- A single `~` is never a delimiter. `markdown-to-jsx` does not treat `20~25` as strikethrough, so there is nothing to escape (unlike `remend`, whose parser does).

**What it fixes**, measured against `markdown-to-jsx` 9.10.4 with no repair, `markdown-to-jsx` with `optimizeForStreaming`, and `remend` 1.4.0:

| Tail of the text          | Without repair                          | Repaired to              | Why                                                                                                                                            |
| ------------------------- | --------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `**bold wor`              | `**` shown literally                    | `**bold wor**`           | Bold from the first streamed character. `optimizeForStreaming` shows it plain, then snaps to bold on close                                     |
| `*ital`, `_ital`, `__b`   | delimiter shown literally               | closed with the same run | Same                                                                                                                                           |
| `***both`                 | `***` shown literally                   | `***both***`             | Same                                                                                                                                           |
| `` `pnpm bui ``           | backtick shown literally                | `` `pnpm bui` ``         | `optimizeForStreaming` drops the span's text entirely until the closer lands, so words vanish and reappear. Code spans are too common for that |
| `~~gone`                  | `~~` shown literally                    | `~~gone~~`               | Same as emphasis                                                                                                                               |
| `[the docs`               | `[` shown literally                     | `the docs`               | Text stays readable; the anchor appears when `)` lands                                                                                         |
| `[the docs](https://exa`  | `[the docs](` shown, partial URL linked | `the docs`               | A half URL must not be clickable. `remend` links to a `streamdown:incomplete-link` placeholder, which needs a custom link component to be safe |
| `![alt` / `![alt](https:` | brackets shown, partial URL linked      | removed                  | A partial image is a broken image                                                                                                              |

Nested cases resolve innermost first: `**see [docs](https://x` becomes `**see docs**`.

**What it leaves alone**, because the parser already does the right thing or the cost is one token's worth of flicker:

| Tail of the text                      | Rendered as                                       | Decision                                                                                                                          |
| ------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Open fence ` ```ts\nconst a `         | A code block that grows                           | Same as upstream. Closing the fence would be a no-op                                                                              |
| `- one\n- tw`, `1. one\n2. tw`        | A list with a partial last item                   | Correct already                                                                                                                   |
| `- one\n-`, `2.`                      | One empty `li` for one token                      | `remend` appends a zero-width space here, which merges the two items into one. Leaving it is better                               |
| `## Sec`, `> quoted wor`, `Second pa` | Heading, blockquote, paragraph                    | Correct already                                                                                                                   |
| `\| a \| b \|` with no divider row    | A paragraph with pipes, until the divider arrives | Hiding it needs block parsing the pre-pass does not do. The flash lasts one or two tokens. See open question 1                    |
| `<b>bold`, `<div class="x`            | `<b>` rendered; the cut tag escaped as text       | The parser's sanitizer and `tagfilter` handle HTML. Nothing local                                                                 |
| Bare `https://exa`                    | An autolink to the partial URL                    | Not a markdown delimiter, and it corrects itself as tokens land. Disabling autolinks is a bigger behavior change than the flicker |
| `$$`, `$x$`                           | Literal text                                      | `markdown-to-jsx` has no math. Out of scope                                                                                       |

**Why a local pre-pass rather than `optimizeForStreaming`:** `markdown-to-jsx` 9 ships its own streaming mode, which the capability map predates. It hides unfinished syntax instead of completing it. In the matrix above that means plain text snapping to bold on close, code-span text disappearing until the closer lands, and link text appearing plain. Completing the syntax, as `remend` does for Streamdown, styles the text from the first character and never removes words the reader has already seen. It is also one mechanism, written once, covering the inline cases the acceptance criteria name. The streaming mode stays off.

### Dependency and bundle

- `markdown-to-jsx` `^9.10.4` goes in `dependencies`. The entry is `markdown-to-jsx/react`; the `/^markdown-to-jsx(\/|$)/` external the scaffold spec reserved matches that subpath, so it stays out of `dist`.
- Measured cost: `dist/react.js` is 78.5 kB minified and 25.3 kB brotli. `pnpm size` bundles it into the `@uiid/ai` number, which lands near 26 kB. The `40 kB` entry stays as it is.
- Storybook resolves `@uiid/ai` from source already. `apps/storybook/package.json` gains `"@uiid/ai": "workspace:*"` as a devDependency so the story typechecks; it is a private app depending on a private package, which is fine. The story imports from `@uiid/ai` directly because the umbrella re-export is deferred to the POC's last step (scaffold spec row 10).

## Files

```
packages/ai/src/markdown/
  markdown.tsx
  markdown.types.ts
  markdown.utils.ts              (repairMarkdown)
  markdown.utils.test.ts
  markdown.test.tsx
  markdown.examples.tsx
  README.md
packages/ai/src/index.ts         (export * from "./markdown")
packages/ai/src/index.test.ts    (the barrel now has a runtime export)
packages/ai/package.json         (markdown-to-jsx, @uiid/typography)
packages/ai/vite.config.ts       (external)
pnpm-lock.yaml
apps/storybook/package.json      (@uiid/ai devDependency)
apps/storybook/stories/ai/markdown.stories.tsx
apps/storybook/stories/ai/markdown.mdx
docs/architecture/ai/capability-map.md   (spec table row)
```

No `.module.css`, no `.constants.ts`, no `.variants.ts`: there is no CSS and nothing to default or vary. Because no stylesheet ships, scaffold row 11 (`@import "@uiid/ai/globals.css"`) and the `./globals.css` export wait for the first module that adds CSS.

## Commands

```
pnpm install
pnpm test:run packages/ai
pnpm run build --filter=@uiid/ai
grep -r '"ai"' packages/ai/dist
pnpm run lint && pnpm run format:check
pnpm size
pnpm --filter @uiid/storybook dev
```

## Testing strategy

Vitest with happy-dom. `markdown-to-jsx` is pure and runs there unchanged.

`markdown.utils.test.ts`, table-driven from the two tables above:

- Every "fixes" row produces the listed output; every "leaves alone" row is returned unchanged.
- A complete document is returned byte-identical (idempotence).
- Scope: a delimiter inside an open fence or a closed code span is ignored; an unmatched `*` in an earlier paragraph is not closed at the end; `\*` is not a delimiter; `snake_case_name` and `5 * 3` are untouched.
- Nesting: `**see [docs](https://x` becomes `**see docs**`.

`markdown.test.tsx`:

- A complete document renders `h1`, `p`, `ul`/`li`, `strong`, `em`, `code`, `a` and `pre > code` inside a root with `data-slot="markdown"`.
- Each block is a direct child of the root, and `Hello` alone renders as a `p`.
- Each cut case from the acceptance criteria renders without throwing, with no raw delimiter in `textContent`, and with no React key warning (spy on `console.error`).
- An open fence renders a `pre > code` containing the partial code.
- `[x](javascript:alert(1))` renders an `a` with no `javascript:` href.
- Spacing props show up as `data-ui-*` attributes; `render={<article />}` swaps the element; `className` merges.
- The barrel exports `Markdown`, and nothing else at runtime.

Checked by hand in Storybook: the `Streaming` story replays a fixture token by token, and the `Partial` story shows every cut case side by side. Both get a look in light and dark.

## Boundaries

- **Always:** style through `Prose` only; keep blocks as direct children of the root; keep `repairMarkdown` pure, dependency-free and limited to the open tail of the last paragraph; import from `markdown-to-jsx/react`; keep the component server-renderable.
- **Ask first:** raising the size limit above `40 kB`; turning on `optimizeForStreaming`; exposing `overrides` or any parser option as a prop; a prop to skip repair; disabling raw HTML or autolinks; any CSS in `@uiid/ai`, which also triggers scaffold row 11 and the `./globals.css` export.
- **Never:** add `remend`, `streamdown`, `react-markdown` or a remark/rehype chain; use `dangerouslySetInnerHTML`; enable `evalUnserializableExpressions`; add typography styles that parallel `Prose`.

## Success criteria

- Every acceptance criterion above holds.
- `pnpm test:run packages/ai`, `pnpm run build --filter=@uiid/ai`, `pnpm run lint`, `pnpm run format:check` and `pnpm size` pass.
- `grep -r '"ai"' packages/ai/dist` returns nothing.
- `Markdown` is exported from `@uiid/ai`, with a story and README-backed MDX page under `apps/storybook/stories/ai/`.
- This spec's row in the capability map reads Approved.

## Follow-ups, not in this module

- `Prose` has no rules for `table`, `del` or `img`, so GFM tables from a model render with browser defaults. That is a `@uiid/typography` change and should be its own ticket.
- Swapping `pre` for `@uiid/code`'s `CodeBlock` belongs to whichever module first needs highlighting, and is where the `@uiid/ai` size limit gets revisited.

## Open questions

1. **Table header flash.** Should `optimizeForStreaming: true` be added alongside the pre-pass? It would hide the header-only table line and the empty trailing bullet, the two block cases left alone above, at no code cost. It would also become a second mechanism to reason about, and its behavior for the inline cases is moot once the pre-pass has closed them. I recommend leaving it off for the POC and deciding from the `Streaming` story.
2. **External links.** Chat UIs usually open links in a new tab. Adding `target="_blank" rel="noreferrer"` to every `a` through `overrides` is a one-liner here, but it would also apply to in-page `#heading` anchors. I recommend leaving links as rendered for now and letting `ai-message` raise it with a concrete need.
