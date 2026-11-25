# CodeInline

> Inline code inside running text. Renders a `<code>` element, plain by default or highlighted by [Shiki](https://shiki.style/) when given a `language`.

Use CodeInline when you want to:

- Mark a command, file name or identifier inside a sentence
- Color a short expression with `language`, which takes the same names and aliases as [CodeBlock](../code-block/README.md)
- Pass pre-highlighted Shiki output as `html` for server rendering

Without `language`, CodeInline renders its children as they are and never loads Shiki: no highlighter, theme or grammar is fetched and nothing is highlighted on the client. With one, a plain string child is highlighted, and the plain text shows until the highlighted markup is ready. Highlighting changes colors only, so the box does not move when it lands. Children that are not a string, such as `<b>x</b>`, render as given, unhighlighted.

`html` is only read when `language` is set. It takes Shiki's output and keeps only the markup inside its `<code>` element, whatever wraps it, and skips the client highlighter: Shiki is never loaded, no theme or grammar is fetched and nothing is highlighted in the browser. Markup with no `<code>` element renders the plain children instead.

Inline code wraps with the text around it: at its spaces, and anywhere inside a run too long for its line, so a long command or path never widens the page or a table cell. A snippet with no spaces moves to the next line whole when it fits there; one with spaces can break at a space near the end of a line, as the words around it do. It takes its size from the surrounding text, scaling with a heading, and inherits a link's color and underline while keeping its own surface.

## Data Slots

| Slot          | Element          |
| ------------- | ---------------- |
| `code-inline` | `<code>` element |

## See Also

- [CodeBlock](../code-block/README.md) - Multi-line, read-only code
