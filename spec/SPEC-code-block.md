# Spec: code-block — V1

Milestone 1. Inherits the shared conventions in `spec/capability-map-code.md`.

## Objective

`CodeBlock` already has copy, wrap, fullscreen, row collapse, server `html` and broad unit tests. It falls short in three ways: it bypasses UIID components, its buttons do not follow the opt-in rule, and nothing proves it holds up in a real browser. This module fixes those and tightens the look, without adding features.

## Current behavior this spec changes

- Fullscreen imports `Dialog` from `@base-ui/react/dialog` directly (`code-block.tsx`).
- The "Show more" toggle is a hand-rolled `<button>` with its own CSS.
- `wrappable` and `fullscreenable` default to `true` (`code.constants.ts`).
- The copy button renders `disabled` when `code` is empty.
- The header bar always renders, even with nothing in it.
- The scroll wrapper, the expand toggle and the fullscreen dialog are not reachable as parts or slots.
- Layout uses the deprecated `fullwidth` toggle.

## Requirements

### Buttons

1. `copyable` defaults to `true`. `wrappable` and `fullscreenable` default to `false`. **Breaking.**
2. A button whose flag is off is not rendered. The copy button is also not rendered when `code` is empty. No code path passes `disabled` to express absence. **Breaking** for the empty-code case.
3. With `fullscreenable` off, no dialog is mounted and no fullscreen code is reachable in the bundle path that renders (the dialog parts stay imported; they render nothing).

### UIID components

4. Fullscreen renders through `@uiid/overlays` `Dialog` parts. `@uiid/code` imports nothing from `@base-ui/react/dialog`.
5. The expand toggle is a UIID `Button`, exported as `CodeBlockExpandToggle`.
6. `fullwidth` is replaced by `w="full"` throughout the package.

### API shape

7. Parts exported: `CodeBlock`, `CodeBlockHeader`, `CodeBlockContent`, `CodeBlockCopyButton`, `CodeBlockWrapButton`, `CodeBlockFullscreenButton`, `CodeBlockExpandToggle`, each with its prop type. A caller can build a block from the parts without `CodeBlock`.
8. New slots on `CodeBlock`: `ContentProps` and `ExpandToggleProps`. Every slot type omits the keys `CodeBlock` owns, proven by a `// @ts-expect-error` test per slot.
9. `expanded` and `onExpandedChange` join `defaultExpanded`, and `wrap` joins `defaultWrap`, so both states can be controlled. `fullscreen` joins `onFullscreenChange` the same way.

### Look and feel

10. One frame: one border, one radius, one surface. No inner border between header and code other than the header's bottom rule.
11. The header bar renders only when it has a filename or a language icon. With neither, the enabled buttons sit in the top-right corner over the code and stay visible without hover, so touch users can reach them.
12. A long filename truncates with an ellipsis; the buttons never wrap, shrink or clip.
13. The expand toggle reads as part of the frame: full width, muted until hover or focus, a fade over the last collapsed line above it.
14. Spacing, radius, border and colors come from tokens. Any new value is added to `code.tokens.json` as a literal or plain reference.
15. Motion (expand, fullscreen, copied state) respects `prefers-reduced-motion`.

### Robustness

16. **No flash, no shift.** The plain fallback and the highlighted result have the same height and the same line positions, with and without line numbers. With server `html` the first paint is already highlighted and nothing changes on hydration.
17. **Long lines.** The block is never wider than its container, including inside a flex or grid parent with no `min-width: 0`. The code scrolls horizontally inside the frame.
18. **Phone widths.** At a 320px viewport a block with a long filename, three buttons and long lines causes no horizontal page scroll.
19. **Theme.** Changing `data-theme` recolors the block with no re-highlight and no flash. A block inside a container with the opposite `data-theme` takes that container's colors.
20. **Nesting.** The block renders correctly inside `Card`, `Dialog` and `Collapsible`. A block first measured while hidden shows the right expand toggle state once revealed. Fullscreen opened from inside a `Dialog` stacks above it and returns focus to the fullscreen button on close.
21. **Keyboard.** A block whose code overflows is a tab stop with an accessible name, so it can be scrolled by keyboard. A block that does not overflow adds no tab stop beyond its buttons.
22. **Edge input.** Empty `code`, a single line, a trailing newline, tab characters, and a line longer than the tokenizer cap all render without error and without an extra blank line.
23. **Errors.** A highlighter failure shows the plain code, not an empty frame, and the error text does not shift the code.

## Testing strategy

- Unit tests cover requirements 1–9, 21–23 and the callbacks. Existing tests are updated for the new defaults, not deleted.
- `code-block.browser.test.tsx` covers 11–13 and 16–20 by measuring real boxes: height before and after highlight, `scrollWidth` against `clientWidth` on the page at 320px, computed colors under each theme.
- Stories: default, filename, no header, each button alone, all buttons, collapsed, long line, nested in Card/Dialog/Collapsible, both themes side by side.

## Boundaries

Deltas only.

- **Ask first:** changing `DialogPopup` or any other `@uiid/overlays` file so the fullscreen view fits.

## Success criteria

- [ ] `git grep "@base-ui/react" packages/code/src` returns nothing outside tests.
- [ ] `git grep "fullwidth" packages/code/src` returns nothing.
- [ ] `<CodeBlock code="x" />` renders exactly one button, the copy button.
- [ ] `<CodeBlock code="" />` renders no button.
- [ ] No `disabled` attribute appears in the block's DOM in any story.
- [ ] Browser tests for requirements 16–20 pass in Chromium.
- [ ] `packages/code/src/index.test.ts` lists `CodeBlockExpandToggle` and its prop type.
- [ ] `pnpm size` passes, or the growth from `@uiid/overlays` is stated in the PR and approved.
- [ ] The owner has looked at the stories and accepted the look.

## Out of scope (deferred)

- Multi-file tabs in the header: milestone 4.
- Line-level features beyond the existing highlight and diff notations (folding, per-line links, annotations).
- Virtualized rendering for very large files.
- A language label or language switcher.

## Open questions

1. **Does `DialogPopup` fit?** It renders a `Card` with a title row and a close button, and the block has its own header. The plan starts with a spike: `DialogPopup size="full"` with `hideCloseButton` and the block's parts as children. If the Card's padding or title row cannot be removed from outside, the choice is between adding a bare popup option to `@uiid/overlays` and keeping one direct Base UI import. Recommendation: add the option to overlays.
2. **Floating buttons (requirement 11).** With no header bar the buttons overlap the first line of code at narrow widths. Recommendation: reserve right padding on the first line only when buttons float. The owner decides by eye from the story.
