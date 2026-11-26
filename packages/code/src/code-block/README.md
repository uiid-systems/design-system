# CodeBlock

> Read-only, syntax-highlighted code powered by [Shiki](https://shiki.style/). A header shows the language icon and filename beside copy, line-wrap and fullscreen buttons, and long code can collapse behind a "Show more" toggle.

Use CodeBlock when you want to:

- Show a snippet or a whole file with highlighting, with `language` taking a bundled language, an alias (`ts`, `sh`, `py`) or any other name, which renders as plain code. It defaults to `typescript`; pass `text` for plain code
- Label it with a `filename`, number its lines with `showLineNumbers`, or mark lines with `highlightLines` (1-indexed)
- Cap a long file at a number of `rows`, with a "Show more" toggle to expand it (`defaultExpanded` starts it open). The toggle appears only when the code overflows its rows; `expandLabel` and `collapseLabel` replace its English text. The cap is written as one `--code-rows` custom property, and the scroll area carries `data-collapsed` while it is capped
- Let readers copy the code, and opt in to soft-wrapping long lines or opening it fullscreen; Escape or the backdrop closes fullscreen

Only the copy button renders by default. Turn it off with `copyable={false}`, and opt in to the others with `wrappable` and `fullscreenable`. A button that is off is not rendered at all, and the copy button is also left out while `code` is empty, rather than shown disabled. Without `fullscreenable` no fullscreen dialog is mounted.

The header bar renders from its content: a `filename`, a `language` that has an icon, or `HeaderProps.children`. With none of them there is no bar, and the buttons float in the top-right corner over the code, always visible, with the end of the first line kept clear for them. In fullscreen, where the code scrolls vertically, every line keeps that space clear, since any line can pass beneath them. A wrapped line breaks before the buttons; an unwrapped one longer than the block scrolls beneath them, and once any line overflows sideways even a short line that reserves the space (the first, or every line in fullscreen) can sit under them. The reserved space fits the buttons at their default size, so a `size` or text children passed through a button's slot props can overlap the code. With no bar and no buttons, nothing is rendered above the code. A long filename truncates with an ellipsis; the buttons never shrink or wrap. Its full text is kept as a native `title` tooltip, which only a mouse hover shows, so it is no way for keyboard, touch or screen reader users to read the name.

While `rows` caps the code, the code area clips at that height rather than scrolling, so "Show more" is the one way to see the rest, and the area is not a tab stop. Long unwrapped lines still scroll sideways. The collapsed area ends on its last row, which fades into the code's background, and the toggle runs the full width of the frame's bottom edge directly beneath it, muted until hovered or focused. When the code fits in its `rows`, there is no toggle and no fade, and nothing is clipped.

The frame takes the editor theme's background, so the code, the frame and the plate behind floating buttons are one surface. The header bar and the toggle sit on the theme's own surface colour.

Wrap, expanded and fullscreen can each be controlled; see [Controlled state](#controlled-state).

Highlighting runs on the client, so the raw code shows until Shiki's output is ready. For server rendering, highlight ahead of time and pass the result as `html`:

```tsx
import { CodeBlock, highlight } from "@uiid/code";

const html = await highlight(code, "typescript");

<CodeBlock code={code} html={html} />;
```

Pass `highlight` the same `language` as the block. Left out, it falls back to `typescript`, the same default CodeBlock uses, so the two still match.

With `html`, CodeBlock skips the client highlighter: Shiki is never loaded, no theme or grammar is fetched and nothing is highlighted in the browser. `code` is still required alongside `html`, because the copy button copies it.

## Controlled state

Wrap, expanded and fullscreen can each be left to CodeBlock or held by the caller. Leave `wrap`, `expanded` or `fullscreen` unset and CodeBlock keeps that state itself, starting from `defaultWrap` and `defaultExpanded`. Fullscreen has no uncontrolled default and always starts closed; to open it on mount, control it with `fullscreen` starting at `true`. Set one and the block shows that value and nothing else: the wrap toggle, the "Show more" toggle, the fullscreen toggle, Escape and the backdrop only ask for a change through `onWrapChange`, `onExpandedChange` and `onFullscreenChange`, and the view stays as it is until the caller passes the new value. Each callback fires once per action with the state asked for, whether or not the state is controlled. A controlled value wins over its `default*` prop, and a prop switched from set to unset falls back to the state CodeBlock kept, which started from that `default*`.

A controlled `fullscreen` must follow `onFullscreenChange(false)`. Escape, the backdrop and the exit button only ask, so a parent that ignores the request leaves a modal view nobody can leave by keyboard.

```tsx
const [fullscreen, setFullscreen] = useState(false);

<CodeBlock
  code={code}
  fullscreenable
  fullscreen={fullscreen}
  onFullscreenChange={setFullscreen}
/>;
```

`fullscreen` needs `fullscreenable`: without it no fullscreen view is mounted, so `fullscreen={true}` opens nothing. `expanded` matters only while `rows` caps the code. Without `rows` nothing collapses and it has no effect. With `rows` and code that fits, there is no toggle, every row shows either way, and `data-expanded` follows the value.

## Fullscreen

Fullscreen opens a modal UIID Dialog, an unstyled `size="full"` `DialogPopup` holding a second copy of the block, named by `filename` (or "Code block"). It fills the dialog viewport inside its padding, up to 1100px wide and centred, and the code scrolls inside it under the header. Focus moves to the dialog, Tab reaches its controls and stays trapped inside, the page behind is hidden from assistive tech and its scroll is locked, and closing returns focus to whatever had it when the view opened: the fullscreen toggle, or the caller's own button when a controlled `fullscreen` was opened from outside. When nothing had focus, because the view opened on mount or from a shortcut, or because Safari does not focus a clicked button, focus goes to the block's fullscreen toggle instead. To return it to your own control in that case, pass `finalFocus`, which takes what the Dialog popup's `finalFocus` takes (a ref, `true`, `false` or a function) and replaces the toggle fallback. Escape dismisses one layer at a time, so a CodeBlock inside a Dialog closes only its fullscreen view.

The inline block stays mounted underneath, so its copy state and "Show more" state are kept. Wrap is shared between the two. The copy gets `className` but no other root props, so a root `id`, `ref` or handler is not duplicated. It gets the slot props (`HeaderProps`, `CopyButtonProps` and the rest) without their `id` and `ref`.

## Slot props

`HeaderProps`, `LanguageIconProps`, `WrapButtonProps`, `CopyButtonProps` and `FullscreenButtonProps` reach the header and its parts. `HeaderProps` takes the header's own layout and element props, such as `gap`, `className` or `children`. What the header shows (`filename`, `language` and the three toggles above), the wrap and fullscreen state, the copied `code` and the four button slots are set on CodeBlock, so passing one through `HeaderProps` is a type error, and at runtime CodeBlock's value wins (for `filename` and `language`, only when CodeBlock's is set). The button slots leave out what CodeBlock sets in the same way: `code` and `onCopy` on `CopyButtonProps`, and `pressed`, `defaultPressed` and `onPressedChange` on `WrapButtonProps` and `FullscreenButtonProps`.

`onCopy` runs after a successful copy. If it throws, the error is logged to the console and the button still shows "Copied". A failed clipboard write runs no handler and shows no "Copied" state. A `CopyButtonProps.onClick` runs before the copy; call `event.preventDefault()` in it to skip copying.

`ContentProps` reaches the highlighted code, inline and fullscreen (without `id` and `ref` in fullscreen, as above), and takes its layout and element props such as `className` or `p`. The code, its highlighting, line numbers and wrap are set on CodeBlock, so `html`, `code`, `showLineNumbers`, `wrap`, `children` and `dangerouslySetInnerHTML` are type errors there. `ExpandToggleProps` reaches the "Show more" toggle and takes its button props such as `className` or `onClick`; `expanded`, `onExpandedChange`, `expandLabel`, `collapseLabel` and `aria-expanded` are set on CodeBlock and cannot be passed through it. In both, CodeBlock's value wins at runtime too, and a `children` or `dangerouslySetInnerHTML` that reaches `ContentProps` untyped is dropped.

## Parts

`CodeBlockHeader`, `CodeBlockCopyButton`, `CodeBlockWrapButton`, `CodeBlockFullscreenButton`, `CodeBlockExpandToggle`, `CodeBlockContent` and `LanguageIcon` are exported for composing a block of your own. Used on its own, `CodeBlockHeader` with no filename, icon or children floats its buttons with `position: absolute` against its nearest positioned ancestor, and nothing keeps the code beside it clear of them; that reserve applies only inside CodeBlock. Pass a `filename` or `children` for a bar. Each icon button names itself and has a tooltip, and the copy button's name changes to "Copied" after a copy. An `aria-label` of your own on the copy button replaces both names, so "Copied" is then never conveyed. `CodeBlockExpandToggle` shows `expandLabel` or `collapseLabel` by its `expanded` prop, sets `aria-expanded` to match, and asks for the opposite state through `onExpandedChange`; an `onClick` that calls `event.preventDefault()` skips the change. CodeBlock adds what the parts leave to you: highlighting (pass `CodeBlockContent` the `html` from `highlight`), the row cap and its toggle, the wrap and fullscreen state behind the toggles' `pressed` and `onPressedChange`, and the fullscreen dialog with its name and focus handling.

A block built from the parts holds its own state and highlighting. `useHighlight` gives the `html`, and `Stack` lays the parts out:

```tsx
import { CodeBlockContent, CodeBlockHeader, useHighlight } from "@uiid/code";
import { Stack } from "@uiid/layout";

const [wrap, setWrap] = useState(false);
const { html } = useHighlight(code, "tsx");

<Stack w="full" b={1}>
  <CodeBlockHeader
    filename="counter.tsx"
    language="tsx"
    code={code}
    wrappable
    wrap={wrap}
    onWrapChange={setWrap}
  />
  <CodeBlockContent html={html || undefined} code={code} wrap={wrap} />
</Stack>;
```

The frame, the row cap and the scroll area around the code are not parts, so a composed block has CodeBlock's header and code but not its frame or collapse.

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
