# Spec: `markdown`

**Module:** `markdown` (see [capability map](./capability-map.md))
**Package:** `@uiid/ai`
**Status:** Approved
**Upstream:** `ai-elements/packages/elements/src/message.tsx` (`MessageResponse`, a thin wrapper over `streamdown`, which repairs with `remend`). The `response.tsx` the Linear issue links to does not exist at `ca8be60`; it was folded into `message.tsx`.
**Depends on:** `ai-scaffold`

## Objective

`Markdown` renders a markdown string as plain HTML elements inside `Prose`, and keeps rendering cleanly when that string is cut off anywhere: mid-word, mid-emphasis, mid-link, mid-fence. It is the renderer behind `MessageResponse`, `Reasoning` and `Tool` output, all of which receive text token by token.

Parsing is `markdown-to-jsx`, imported from its `markdown-to-jsx/react` entry. Streaming safety is the parser's own `optimizeForStreaming` option, exposed as a `streaming` prop. There is no local repair pass. All styling comes from `Prose`. This module adds no CSS.

Upstream is sixteen runtime dependencies: a remark/rehype pipeline, `remend`, shiki, math, mermaid, copy and download buttons, and Tailwind classes. None of that is ported. The component is one element around one compiler call.

**Acceptance criteria:**

- `<Markdown>{source}</Markdown>` with a complete document renders headings, paragraphs, lists, links, emphasis, inline code and fenced code as the usual elements, directly inside a `Prose` root with `data-slot="markdown"`.
- Block elements are direct children of that root. There is no wrapper `div` between `Prose` and the blocks, so `Prose`'s sibling rhythm applies.
- A one-line string renders as a `<p>`, not as bare inline text.
- Every `Prose` prop passes through: spacing props, `render`, `className`, `style`, `ref` and DOM attributes.
- With `streaming`, a string cut mid-emphasis, mid-code-span, mid-strikethrough, mid-link, mid-image or mid-fence renders without throwing, and its text content contains none of the raw delimiters `**`, `*`, `_`, `` ` ``, `~~`, `[`, `](`.
- With `streaming`, a string cut mid-fence renders the open fence as a code block that grows as tokens land.
- Without `streaming`, finished text renders every character, including a stray delimiter the model never closed.
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
  /**
   * Hold back unfinished syntax while the text is still arriving, so a
   * half-typed `**` or `[link](` never shows. Turn it off once the message is
   * complete: on finished text it would also hide anything after a stray
   * delimiter the model never closed.
   */
  streaming?: boolean;
};
```

`streaming` defaults to `false`, the setting that never drops text. Consumers set it from the status they already have: `MessageResponse` passes `status === "streaming"`, and `Reasoning` and `Tool` pass their own in-progress flags. `overrides` and other parser options are not exposed (see Boundaries).

## Implementation notes

### Component

```tsx
import { compiler } from "markdown-to-jsx/react";
import { Prose } from "@uiid/typography";

import type { MarkdownProps } from "./markdown.types";

export const Markdown = ({
  children,
  streaming = false,
  ...props
}: MarkdownProps) => (
  <Prose data-slot="markdown" {...props}>
    {compiler(children, {
      wrapper: null,
      forceBlock: true,
      optimizeForStreaming: streaming,
    })}
  </Prose>
);
```

- `wrapper: null` makes the compiler return its children without a wrapper element, which is what keeps the blocks as direct children of `Prose`. With one block it returns that element; with several it returns a keyed array.
- `forceBlock: true` makes a single line render as `<p>` instead of inline text, so `Prose`'s `& > p` rules apply to the shortest message.
- `data-slot="markdown"` is written inline in JSX, where hyphenated attributes are exempt from excess-property checks. `prepareComponentProps` spreads the caller's props after its own `data-slot`, so it wins over `Prose`'s `prose`.
- Every other option stays at its default. Raw HTML is parsed, with the library's always-on attribute sanitizer and the default `tagfilter`, which escapes `script`, `iframe`, `style` and kin.
- No `memo`, no `useMemo`. The compile is linear in the text and runs once per render. `ai-message` memoizes `MessageResponse` on `children` the way upstream does, which is the right level for it.
- Headings get an `id` from the library's slugifier. A transcript with many messages may therefore repeat ids. Left alone for the POC; revisit if it shows up in an accessibility check.

### What `streaming` does

`optimizeForStreaming` holds back syntax whose closing delimiter has not arrived. Measured against `markdown-to-jsx` 9.10.4 with cut-off inputs:

| Tail of the text                          | Without `streaming`                        | With `streaming`                                |
| ----------------------------------------- | ------------------------------------------ | ----------------------------------------------- |
| `**bold wor`, `*ital`, `_ital`, `***both` | delimiter shown literally                  | text shown plain, styled once the closer lands  |
| `` `pnpm bui ``                           | backtick shown literally                   | span held back until the closing backtick lands |
| `~~gone`                                  | `~~` shown literally                       | text shown plain until the closer lands         |
| `[the docs`, `[the docs](https://exa`     | brackets shown, the partial URL autolinked | text shown plain, linked once `)` lands         |
| `![alt](https://exa`                      | brackets shown, the partial URL autolinked | held back                                       |
| `\| a \| b \|` before its divider row     | a paragraph with pipes                     | held back until the table has a data row        |
| `- one\n-`                                | one empty `li`                             | the empty item held back                        |
| `<div class="x`                           | escaped as text                            | held back                                       |
| ` ```ts\nconst a ` (open fence)           | a code block that grows                    | same                                            |
| `- one\n- tw`, `## Sec`, `> quoted wor`   | list, heading, blockquote                  | same                                            |

In every row nothing the reader has already seen disappears, because held-back syntax was never shown. The one visible cost is that a code span's text appears all at once on its closing backtick rather than character by character, a gap of a few tokens.

On finished text the option behaves differently, which is why it is a prop and not always on. A stray `[` or backtick that the model never closes hides everything after it: `a lone [ bracket in prose` renders as `a lone bracket in prose`, and `text with a stray `backtick`loses`backtick`. Unclosed emphasis just renders plain. With `streaming` off, all of these render character for character, which is the right behavior once the message is complete.

### Why this and not a local repair pass

The capability map said "streaming markdown repair is written locally, not `remend`", a decision made before `markdown-to-jsx` 9's streaming mode was known. A first draft of this spec kept a local pre-pass that completes unfinished syntax the way `remend` does, so bold renders bold from its first character and a code span's text streams visibly. That is upstream's polish, not a requirement. The pre-pass was roughly eighty lines plus a table of tests, and still left the table-header and empty-bullet cases above uncovered; the parser option is one line and covers all of them. The map's decision row now names the option. If the code-span gap proves bothersome in the Streaming story, a completion pass can be added later as an isolated utility without changing the component's API.

### Dependency and bundle

- `markdown-to-jsx` `^9.10.4` goes in `dependencies`, with `@uiid/typography` as `workspace:*`. The entry is `markdown-to-jsx/react`; the `/^markdown-to-jsx(\/|$)/` external the scaffold spec reserved matches that subpath, so it stays out of `dist`.
- Measured cost: `dist/react.js` is 78.5 kB minified and 25.3 kB brotli. `pnpm size` bundles it into the `@uiid/ai` number, which lands near 26 kB. The `40 kB` entry stays as it is.
- Storybook resolves `@uiid/ai` from source already. `apps/storybook/package.json` gains `"@uiid/ai": "workspace:*"` next to its other `@uiid/*` dependencies so the story typechecks; it is a private app depending on a private package, which is fine. The story imports from `@uiid/ai` directly because the umbrella re-export is deferred to the POC's last step (scaffold spec row 10).

## Files

```
packages/ai/src/markdown/
  markdown.tsx
  markdown.types.ts
  markdown.test.tsx
  markdown.examples.tsx
  README.md
packages/ai/src/index.ts         (export * from "./markdown")
packages/ai/src/index.test.ts    (the barrel now has a runtime export)
packages/ai/package.json         (markdown-to-jsx, @uiid/typography)
packages/ai/vite.config.ts       (external)
pnpm-lock.yaml
apps/storybook/package.json      (@uiid/ai dependency)
apps/storybook/stories/ai/markdown.stories.tsx
apps/storybook/stories/ai/markdown.mdx
docs/architecture/ai/capability-map.md   (decision row, spec table row)
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

Vitest with happy-dom. `markdown-to-jsx` is pure and runs there unchanged. All in `markdown.test.tsx`:

- A complete document renders `h1`, `p`, `ul`/`li`, `strong`, `em`, `code`, `a` and `pre > code` inside a root with `data-slot="markdown"`.
- Each block is a direct child of the root, and `Hello` alone renders as a `p`.
- With `streaming`, each cut case from the table renders without throwing, with no raw delimiter in `textContent`, and with no React key warning (spy on `console.error`).
- With `streaming`, an open fence renders a `pre > code` containing the partial code.
- Without `streaming`, `text with a stray `backtick`keeps the word`backtick`.
- `[x](javascript:alert(1))` renders an `a` with no `javascript:` href.
- Spacing props show up as `data-ui-*` attributes; `render={<article />}` swaps the element; `className` merges.
- The barrel exports `Markdown`, and nothing else at runtime.

Checked by hand in Storybook: the `Streaming` story replays a fixture token by token with `streaming` on, and flips it off when the replay ends. Both themes get a look.

## Boundaries

- **Always:** style through `Prose` only; keep blocks as direct children of the root; import from `markdown-to-jsx/react`; keep the component server-renderable.
- **Ask first:** raising the size limit above `40 kB`; adding a local repair pass; exposing `overrides` or any other parser option as a prop; disabling raw HTML or autolinks; any CSS in `@uiid/ai`, which also triggers scaffold row 11 and the `./globals.css` export.
- **Never:** add `remend`, `streamdown`, `react-markdown` or a remark/rehype chain; use `dangerouslySetInnerHTML`; enable `evalUnserializableExpressions`; add typography styles that parallel `Prose`.

## Success criteria

- Every acceptance criterion above holds.
- `pnpm test:run packages/ai`, `pnpm run build --filter=@uiid/ai`, `pnpm run lint`, `pnpm run format:check` and `pnpm size` pass.
- `grep -r '"ai"' packages/ai/dist` returns nothing.
- `Markdown` is exported from `@uiid/ai`, with a story and README-backed MDX page under `apps/storybook/stories/ai/`.

## Follow-ups, not in this module

- `Prose` has no rules for `table`, `del` or `img`, so GFM tables from a model render with browser defaults. That is a `@uiid/typography` change and should be its own ticket.
- Swapping `pre` for `@uiid/code`'s `CodeBlock` belongs to whichever module first needs highlighting, and is where the `@uiid/ai` size limit gets revisited.

## Open questions

1. **External links.** Chat UIs usually open links in a new tab. Adding `target="_blank" rel="noreferrer"` to every `a` through `overrides` is a one-liner here, but it would also apply to in-page `#heading` anchors. Left as rendered for now; `ai-message` raises it with a concrete need.
