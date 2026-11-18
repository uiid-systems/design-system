# CodeBlock

> Read-only, syntax-highlighted code powered by [Shiki](https://shiki.style/). A header shows the language icon and filename beside copy, line-wrap and fullscreen buttons, and long code can collapse behind a "Show more" toggle.

Use CodeBlock when you want to:

- Show a snippet or a whole file with highlighting, with `language` taking a bundled language, an alias (`ts`, `sh`, `py`) or any other name, which renders as plain code. It defaults to `typescript`; pass `text` for plain code
- Label it with a `filename`, number its lines with `showLineNumbers`, or mark lines with `highlightLines` (1-indexed)
- Cap a long file at a number of `rows`, with a "Show more" toggle to expand it (`defaultExpanded` starts it open)
- Let readers copy the code, soft-wrap long lines, or open it fullscreen; Escape or the backdrop closes fullscreen

The copy, wrap and fullscreen buttons all render by default. Turn any of them off with `copyable={false}`, `wrappable={false}` or `fullscreenable={false}`. The header row renders even with all three off, so pass a `filename` or `language` to give it something to show.

Wrap and fullscreen are uncontrolled. `defaultWrap` sets the initial wrap state, and `onWrapChange`, `onFullscreenChange` and `onCopy` report changes. There is no `wrap` or `fullscreen` prop to control them from outside.

Highlighting runs on the client, so the raw code shows until Shiki's output is ready. For server rendering, highlight ahead of time and pass the result as `html`:

```tsx
import { CodeBlock, highlight } from "@uiid/code";

const html = await highlight(code, "typescript");

<CodeBlock code={code} html={html} />;
```

`code` is still required alongside `html`, because the copy button copies it.

## Slot props

`HeaderProps`, `LanguageIconProps`, `WrapButtonProps`, `CopyButtonProps` and `FullscreenButtonProps` reach the header and its parts. `HeaderProps` spreads last, so it overrides any header prop CodeBlock sets, including the three toggles above. A `CopyButtonProps` passed inside `HeaderProps` replaces the merged one, which drops the top-level `onCopy`.

## Data Slots

| Slot                           | Element                                  |
| ------------------------------ | ---------------------------------------- |
| `code-block`                   | Root container                           |
| `code-block-header`            | Header row                               |
| `code-block-copy-button`       | Copy button                              |
| `code-block-wrap-button`       | Line-wrap toggle                         |
| `code-block-fullscreen-button` | Fullscreen toggle                        |
| `language-icon`                | Language icon, when `language` is set    |
| `code-block-scroll`            | Scroll area around the code              |
| `code-block-content`           | Highlighted code                         |
| `code-block-expand-toggle`     | "Show more" / "Show less" button         |
| `code-block-fullscreen`        | Fullscreen overlay, portaled to the body |
| `code-block-backdrop`          | Fullscreen backdrop, closes on click     |
| `code-block-error`             | Highlighting error message               |

The root carries each state attribute only while that state is on: `data-wrap` while lines wrap, `data-fullscreen` while fullscreen, and `data-expanded` only when `rows` is set and the block is expanded.

## See Also

- [CodeInline](../code-inline/README.md) - Inline code inside text
- [CodeEditor](../code-editor/README.md) - Editable code with the same header
