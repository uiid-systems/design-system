# CodeBlock

> Read-only, syntax-highlighted code powered by [Shiki](https://shiki.style/). A header shows the language icon and filename beside copy, line-wrap and fullscreen buttons, and long code can collapse behind a "Show more" toggle.

Use CodeBlock when you want to:

- Show a snippet or a whole file with highlighting, with `language` taking a bundled language, an alias (`ts`, `sh`, `py`) or any other name, which renders as plain code. It defaults to `typescript`; pass `text` for plain code
- Label it with a `filename`, number its lines with `showLineNumbers`, or mark lines with `highlightLines` (1-indexed)
- Cap a long file at a number of `rows`, with a "Show more" toggle to expand it (`defaultExpanded` starts it open). The toggle appears only when the code overflows its rows; `expandLabel` and `collapseLabel` replace its English text. The cap is written as one `--code-rows` custom property, and the scroll area carries `data-collapsed` while it is capped
- Let readers copy the code, and opt in to soft-wrapping long lines or opening it fullscreen; Escape or the backdrop closes fullscreen

Only the copy button renders by default. Turn it off with `copyable={false}`, and opt in to the others with `wrappable` and `fullscreenable`. A button that is off is not rendered at all, and the copy button is also left out while `code` is empty, rather than shown disabled. Without `fullscreenable` no fullscreen dialog is mounted.

The header bar renders from its content: a `filename`, a `language` that has an icon, or `HeaderProps.children`. With none of them there is no bar, and the buttons float in the top-right corner over the code, always visible, with the end of the first line kept clear for them. A wrapped first line breaks before the buttons; an unwrapped one longer than the block scrolls beneath them. With no bar and no buttons, nothing is rendered above the code. A long filename truncates with an ellipsis and keeps its full text as a native tooltip; the buttons never shrink or wrap.

While `rows` caps the code, the last visible line fades out and the "Show more" toggle runs the full width of the frame's bottom edge, muted until hovered or focused.

Wrap and fullscreen are uncontrolled. `defaultWrap` sets the initial wrap state, and `onWrapChange`, `onFullscreenChange` and `onCopy` report changes. There is no `wrap` or `fullscreen` prop to control them from outside.

Highlighting runs on the client, so the raw code shows until Shiki's output is ready. For server rendering, highlight ahead of time and pass the result as `html`:

```tsx
import { CodeBlock, highlight } from "@uiid/code";

const html = await highlight(code, "typescript");

<CodeBlock code={code} html={html} />;
```

Pass `highlight` the same `language` as the block. Left out, it falls back to `typescript`, the same default CodeBlock uses, so the two still match.

With `html`, CodeBlock skips the client highlighter: Shiki is never loaded, no theme or grammar is fetched and nothing is highlighted in the browser. `code` is still required alongside `html`, because the copy button copies it.

## Fullscreen

Fullscreen opens a modal Base UI Dialog holding a second copy of the block, named by `filename` (or "Code block"). Focus moves to the dialog, Tab reaches its controls and stays trapped inside, the page behind is hidden from assistive tech and its scroll is locked, and closing returns focus to the toggle that opened it. Escape dismisses one layer at a time, so a CodeBlock inside a Dialog closes only its fullscreen view.

The inline block stays mounted underneath, so its copy state and "Show more" state are kept. Wrap is shared between the two. The copy gets `className` but no other root props, so a root `id`, `ref` or handler is not duplicated. It gets the slot props (`HeaderProps`, `CopyButtonProps` and the rest) without their `id` and `ref`.

## Slot props

`HeaderProps`, `LanguageIconProps`, `WrapButtonProps`, `CopyButtonProps` and `FullscreenButtonProps` reach the header and its parts. `HeaderProps` takes the header's own layout and element props, such as `gap`, `className` or `children`. What the header shows (`filename`, `language` and the three toggles above), the wrap and fullscreen state, the copied `code` and the four button slots are set on CodeBlock, so passing one through `HeaderProps` is a type error, and at runtime CodeBlock's value wins (for `filename` and `language`, only when CodeBlock's is set). The button slots leave out what CodeBlock sets in the same way: `code` and `onCopy` on `CopyButtonProps`, and `pressed`, `defaultPressed` and `onPressedChange` on `WrapButtonProps` and `FullscreenButtonProps`.

`onCopy` runs after a successful copy. If it throws, the error is logged to the console and the button still shows "Copied". A failed clipboard write runs no handler and shows no "Copied" state. A `CopyButtonProps.onClick` runs before the copy; call `event.preventDefault()` in it to skip copying.

## Parts

`CodeBlockHeader`, `CodeBlockCopyButton`, `CodeBlockWrapButton`, `CodeBlockFullscreenButton`, `CodeBlockExpandToggle`, `CodeBlockContent` and `LanguageIcon` are exported for composing a block of your own, as CodeEditor does with the header. Each icon button names itself and has a tooltip, and the copy button's name changes to "Copied" after a copy. An `aria-label` of your own on the copy button replaces both names, so "Copied" is then never conveyed. `CodeBlockExpandToggle` shows `expandLabel` or `collapseLabel` by its `expanded` prop, sets `aria-expanded` to match, and asks for the opposite state through `onExpandedChange`; an `onClick` that calls `event.preventDefault()` skips the change. CodeBlock adds what the parts leave to you: highlighting (pass `CodeBlockContent` the `html` from `highlight`), the row cap and its toggle, the wrap and fullscreen state behind the toggles' `pressed` and `onPressedChange`, and the fullscreen dialog with its name and focus handling.

## Data Slots

| Slot                           | Element                                  |
| ------------------------------ | ---------------------------------------- |
| `code-block`                   | Root container, and the fullscreen popup |
| `code-block-header`            | Header bar, or the floating buttons' box |
| `code-block-title`             | Language icon and filename in the bar    |
| `code-block-actions`           | The header's buttons                     |
| `code-block-copy-button`       | Copy button                              |
| `code-block-wrap-button`       | Line-wrap toggle                         |
| `code-block-fullscreen-button` | Fullscreen toggle                        |
| `language-icon`                | Language icon, when `language` is set    |
| `code-block-scroll`            | Scroll area around the code              |
| `code-block-content`           | Highlighted code                         |
| `code-block-expand-toggle`     | "Show more" / "Show less" button         |
| `code-block-fullscreen`        | Fullscreen portal on the body            |
| `code-block-backdrop`          | Fullscreen backdrop, closes on click     |
| `code-block-error`             | Highlighting error message               |

The root carries each state attribute only while that state is on: `data-wrap` while lines wrap, and `data-expanded` only when `rows` is set and the block is expanded. `data-fullscreen` marks the fullscreen popup, not the inline root. The header carries `data-floating` when it has no bar and its buttons float.

## See Also

- [CodeInline](../code-inline/README.md) - Inline code inside text
- [CodeEditor](../code-editor/README.md) - Editable code with the same header
