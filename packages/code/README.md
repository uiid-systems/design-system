# @uiid/code

Syntax highlighting components for the UIID Design System, powered by [Shiki](https://shiki.style/).

## Installation

```bash
pnpm add @uiid/code
```

## Usage

### CodeBlock

Display code blocks with syntax highlighting:

```tsx
import { CodeBlock } from "@uiid/code";

// Basic usage
<CodeBlock code={myCode} language="typescript" />

// With features
<CodeBlock
  code={myCode}
  language="typescript"
  filename="example.ts"
  showLineNumbers
  copyable
/>

// With pre-rendered HTML (SSR)
<CodeBlock code={myCode} html={prerenderedHtml} />
```

### CodeInline

Display inline code with optional syntax highlighting:

```tsx
import { CodeInline } from "@uiid/code";

// Plain inline code
<CodeInline>npm install</CodeInline>

// With syntax highlighting
<CodeInline language="typescript">const x: number = 42;</CodeInline>

// In text
<p>
  Run <CodeInline>npm install</CodeInline> to install dependencies.
</p>
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
import { useHighlight, useHighlighter } from "@uiid/code";

function MyComponent() {
  const { html, loading, error } = useHighlight(code, "typescript");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

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

## Props

### CodeBlock

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `code` | `string` | Required | The code to display |
| `language` | `BundledLanguage` | `"typescript"` | Programming language |
| `filename` | `string` | - | Filename to display in header |
| `showLineNumbers` | `boolean` | `false` | Show line numbers |
| `copyable` | `boolean` | `true` | Show copy button |
| `highlightLines` | `number[]` | - | Lines to highlight (1-indexed) |
| `html` | `string` | - | Pre-highlighted HTML for SSR |

### CodeInline

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `language` | `BundledLanguage` | - | Programming language (optional) |
| `html` | `string` | - | Pre-highlighted HTML for SSR |

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
