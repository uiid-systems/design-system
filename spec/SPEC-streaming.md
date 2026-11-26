# Spec: streaming — V1

Milestone 1. Depends on `code-block`. Inherits the shared conventions in `spec/capability-map-code.md`.

## Objective

A `CodeBlock` whose `code` prop grows a few characters at a time, as in a chat response, must look calm and stay correct. This module is about the block itself. Connecting it to `@uiid/markdown` is the `markdown-code` module.

## Current behavior this spec changes

- `useHighlight` starts a new highlight on every change of `code` and lets each one run to completion, discarding all but the last result. A fast stream queues work it throws away.
- While a highlight is pending the block keeps showing the previous highlighted markup, so the newest characters are not visible until the pass finishes.
- Nothing tests the block under a changing `code` prop in a real browser.

## Requirements

1. **Never back to plain.** Once highlighted code has been shown, the block does not fall back to the plain rendering for the rest of the stream.
2. **Text is current.** Every character in `code` is visible in the frame that follows the update. Characters past the last highlighted position may be uncolored until the next pass.
3. **Bounded work.** At most one highlight runs at a time, with at most one waiting. Intermediate values are skipped.
4. **Final state.** When the stream stops, the markup equals what a single highlight of the full text produces.
5. **Height only grows by lines.** The block's height changes only when a line is added. No jump when a pass lands.
6. **Rows.** With `rows`, the expand toggle appears when the code first exceeds the row count and does not flicker afterwards. An expanded block stays expanded.
7. **Copy.** The copy button copies the text at the moment it is pressed.
8. **Language.** A `language` that changes mid-stream, or arrives after the first characters, re-highlights without violating requirement 1.
9. **Partial syntax.** An unterminated string, comment or tag at the end of the text renders without error.
10. No new public prop is needed for the above. If one turns out to be necessary, it is named `streaming` to match `Markdown`.

## Testing strategy

- Unit tests cover 3, 4, 7 and 8 with a controlled highlighter.
- `code-block.streaming.browser.test.tsx` streams a 200-line `tsx` file in 400 chunks and, on every frame, asserts that the block is not in its plain state after the first highlight, that the rendered text equals the current `code`, and that height never decreases. At the end it compares the markup with a one-shot highlight.
- Story: a block that streams a file on load, with a replay control.

## Success criteria

- [ ] The browser test above passes with zero plain frames after the first highlight.
- [ ] The number of `highlight()` calls for the 400-chunk stream is well under 400 and is asserted with an upper bound in the unit test.
- [ ] Final markup equals the one-shot markup.
- [ ] Existing highlighter tests pass unchanged, or their changes are explained in the PR.

## Out of scope (deferred)

- Incremental tokenizing that reuses the previous pass's grammar state.
- A typing cursor or other streaming decoration.
- Auto-scrolling the block or the page to follow the stream.

## Open questions

1. **How is requirement 2 met?** The likely answer is to render the highlighted markup for the last completed pass plus the plain remainder after it. The plan confirms this keeps line positions stable when the pass lands (requirement 5).
