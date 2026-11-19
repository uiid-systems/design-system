# @uiid/code

Syntax highlighting components for the UIID Design System, powered by [Shiki](https://shiki.style/).

## Installation

```bash
pnpm add @uiid/code
```

## Usage

Each component documents its own props and behavior:

- [CodeBlock](./src/code-block/README.md) - Read-only code with copy, wrap and fullscreen buttons
- [CodeInline](./src/code-inline/README.md) - Inline code inside text
- [CodeEditor](./src/code-editor/README.md) - Editable code with live highlighting

```tsx
import { CodeBlock, CodeInline } from "@uiid/code";

<CodeBlock
  code={myCode}
  language="typescript"
  filename="example.ts"
  showLineNumbers
/>

<CodeInline>npm install</CodeInline>
```

### Highlighter Utilities

For advanced usage, access the highlighter directly:

```ts
import { highlight, getHighlighter, loadLanguage } from "@uiid/code";

// Highlight code
const html = await highlight(code, "typescript");

// Get the highlighter instance
const highlighter = await getHighlighter();

// Load a specific language
await loadLanguage("python");
```

### Hooks

```tsx
import { useHighlight } from "@uiid/code";

function MyComponent() {
  const { html, loading, error } = useHighlight(code, "typescript");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

Pass `{ enabled: false }` as the third argument to skip highlighting when there is nothing to do, such as plain code or pre-rendered `html`. No theme or grammar is fetched, and the hook returns empty `html` with `loading` false.

`useHighlighter` is deprecated and will be removed in a later release. Call `getHighlighter()` or `loadLanguage()` directly instead.

## Supported Languages

- JavaScript (`javascript`)
- TypeScript (`typescript`)
- JSX (`jsx`)
- TSX (`tsx`)
- JSON (`json`)
- CSS (`css`)
- HTML (`html`)
- Bash (`bash`)
- Markdown (`markdown`)
- Python (`python`)

`language` also accepts these aliases, in any letter case:

| Alias                | Language     |
| -------------------- | ------------ |
| `js`                 | `javascript` |
| `ts`                 | `typescript` |
| `sh`, `shell`, `zsh` | `bash`       |
| `py`                 | `python`     |
| `md`                 | `markdown`   |

Any other name, such as `text` or `mermaid`, renders as plain, uncolored code with the same line markup. Nothing throws and no error is shown, so a markdown fence's language can be passed straight through. `resolveLanguage(name)` returns the bundled language a name maps to, or `undefined` when it will render plain.

## SSR Support

For server-side rendering, pre-highlight your code and pass it via the `html` prop:

```tsx
// Server component
import { highlight } from "@uiid/code";

const html = await highlight(code, "typescript");
return <CodeBlock code={code} html={html} />;
```

## License

MIT
