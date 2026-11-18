# CodeInline

> Inline code inside running text. Renders a `<code>` element, plain by default or highlighted by [Shiki](https://shiki.style/) when given a `language`.

Use CodeInline when you want to:

- Mark a command, file name or identifier inside a sentence
- Color a short expression with `language`, which takes the same names and aliases as [CodeBlock](../code-block/README.md)
- Pass pre-highlighted Shiki output as `html` for server rendering

Without `language`, CodeInline renders its children as they are and never loads Shiki: no highlighter, theme or grammar is fetched and nothing is highlighted on the client. With one, `children` must be a plain string, since that string is what gets highlighted; the plain text shows until the highlighted markup is ready.

`html` is only read when `language` is set. It takes Shiki's full `<pre><code>` output and keeps only the inner markup, and skips the client highlighter: Shiki is never loaded, no theme or grammar is fetched and nothing is highlighted in the browser.

## Data Slots

| Slot          | Element          |
| ------------- | ---------------- |
| `code-inline` | `<code>` element |

## See Also

- [CodeBlock](../code-block/README.md) - Multi-line, read-only code
