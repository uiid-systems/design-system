# Spec: code-editor — V1

Milestone 1. Depends on `code-block`. Inherits the shared conventions in `spec/capability-map-code.md`.

## Objective

`CodeEditor` is a transparent `<textarea>` over a highlighted copy of its text. That design only works if the two layers stay aligned and in step. This module proves they do, applies the same button and slot rules as the block, and matches the block's look.

## Current behavior this spec changes

- The header is shared with `CodeBlock`, so it inherits that module's header changes.
- The copy button renders `disabled` when the editor is empty.
- Layout uses the deprecated `fullwidth` toggle.
- Nothing tests layer alignment in a real browser.

## Requirements

### Buttons and API

1. `copyable` stays on by default. The copy button is not rendered when the value is empty.
2. The header follows `code-block` requirement 11: with no filename, no bar; the copy button sits in the top-right corner.
3. Slot types (`HeaderProps`, `CopyButtonProps`, `TextareaProps`) omit owned keys, each proven by a `// @ts-expect-error` test.
4. `fullwidth` is replaced by `w="full"`.

### Look and feel

5. The editor's frame, header, padding, line-number gutter and typography match `CodeBlock` exactly, so a block and an editor stacked together line up.
6. Focus is shown on the frame, not as a ring inside it. Disabled and read-only states are visibly different from each other and from the default.

### Robustness

7. **Alignment.** The caret sits on the glyph it belongs to at every scroll offset, with and without line numbers, with long lines, and at a 320px width.
8. **Typing.** A typed character is visible in the same frame it is typed. The highlight may lag by one pass; the text may not.
9. **Scroll.** The highlight layer follows the textarea's scroll on both axes, including after a paste that moves the scroll position and after programmatic value changes.
10. **Rows.** With `rows`, the editor is that tall and scrolls inside; without it, it grows with its content.
11. **Edge input.** Empty value with a placeholder, a trailing newline, tab characters, and a controlled value that changes from outside all keep the layers aligned.
12. **Forms.** `TextareaProps.name` submits the value in a form, and a label reaches the textarea through `aria-labelledby` or the default `aria-label`.
13. Theme behavior matches `code-block` requirement 19.

## Testing strategy

- Unit tests cover 1–4, 10 and 12. Existing tests are updated for the header change.
- `code-editor.browser.test.tsx` covers 7–9 and 11: type and paste with real input, then compare the caret rectangle with the matching glyph's rectangle in the highlight layer.
- Stories: default, filename, line numbers, rows, read-only, disabled, long lines, stacked under a `CodeBlock`, both themes.

## Success criteria

- [ ] Caret-to-glyph offset is under 1px in every browser test case.
- [ ] After typing one character, the textarea's value and the visible text agree before the next highlight resolves.
- [ ] An empty editor renders no button.
- [ ] `git grep "fullwidth" packages/code/src/code-editor` returns nothing.
- [ ] Unit and browser tests pass.

## Out of scope (deferred)

- Editing features: Tab to indent, auto-closing brackets, multi-cursor, undo history beyond the browser's.
- Soft wrap in the editor.
- Wrap and fullscreen buttons on the editor.

## Open questions

1. **How is requirement 8 met?** Two options: show the textarea's own text until the highlight for the current value lands, or render the unhighlighted tail on top of the last highlight. The plan picks one after measuring which keeps the caret steadier.
