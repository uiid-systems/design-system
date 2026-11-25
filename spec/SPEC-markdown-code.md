# Spec: markdown-code — V1

Milestone 3. Depends on `streaming`. Inherits the shared conventions in `spec/capability-map-code.md`.

## Objective

Fenced code in markdown renders through the hardened `CodeBlock`, so a chat response in `@uiid/ai` shows highlighted, copyable code that stays calm while it streams.

## Current state

- `@uiid/markdown` depends on `@uiid/typography`, `@uiid/utils` and `markdown-to-jsx`. It does not depend on `@uiid/code`, and a fenced block renders as a plain `<pre>` styled by `Prose`.
- `Markdown` has no hooks, so it renders in a server component. Only `reveal` makes it a client component.
- `overrides` accepts `a` and `img` only; `pickOverrides` drops every other key on purpose.
- `@uiid/ai` renders `Markdown` in `MessageResponse` and `Reasoning`. `@uiid/ai` does not depend on `@uiid/code` either.

## Requirements

1. `MarkdownOverrides` gains a key for fenced code. Its component receives the block's text and its language, not raw element props.
2. `@uiid/markdown` gains no dependency. Without the override, fenced code renders as it does today.
3. `@uiid/ai` passes `CodeBlock` for that key by default in `MessageResponse` and `Reasoning`, and gains `@uiid/code` as a dependency. A caller can replace or remove it.
4. The info string after the fence sets the language. An unknown or missing language renders plain. The language is never used for anything but highlighter lookup.
5. While streaming, an unfinished fence renders as a code block from its first line, and the same component instance receives the growing text, so the `streaming` module's guarantees apply: no remount per token, no return to plain.
6. `reveal` keeps skipping code blocks: code appears as it arrives, without the per-word fade.
7. In chat, the block shows the copy button and nothing else by default, with no filename bar.
8. Code text is rendered as text. Raw HTML inside a fence is never parsed, as today.
9. A block inside a list item or a blockquote keeps its frame and scrolls inside it at 320px.

## Testing strategy

- Unit tests in `@uiid/markdown` cover 1, 2, 4, 6 and 8, including a mount counter proving requirement 5.
- Unit tests in `@uiid/ai` cover 3 and 7.
- A browser test streams a message containing prose, a fenced `tsx` block and more prose, and asserts the `streaming` module's frame-level checks on the block.
- Stories: a finished message with code, a streaming message with code, code inside a list.

## Boundaries

Deltas only.

- **Ask first:** making `@uiid/markdown` depend on `@uiid/code`; widening `overrides` beyond the one new key.

## Success criteria

- [ ] A fenced block in a default `MessageResponse` renders `[data-slot="code-block"]` with one copy button.
- [ ] `Markdown` without the override renders the same markup as before this module.
- [ ] The code component mounts once across a 400-chunk stream.
- [ ] `pnpm size` shows no growth for `@uiid/markdown`.
- [ ] Unit and browser tests pass.

## Out of scope (deferred)

- Inline code through `CodeInline`. `Prose` already styles it.
- Rendering diagrams or other fenced languages as something other than code.
- Server-side highlighting of markdown code.

## Open questions

1. **Where the dependency lives.** Requirements 2 and 3 keep `@uiid/markdown` free of `@uiid/code` and put the wiring in `@uiid/ai`. The alternative is for `Markdown` to render `CodeBlock` itself, which is simpler for callers but pulls buttons, the highlighter loader and overlays into every markdown consumer. Recommendation: as written.
2. **Override shape.** What the new key is called and exactly which props it receives is settled against `markdown-to-jsx`'s API in the plan.
