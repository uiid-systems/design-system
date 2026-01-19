# CodeEditor

> Syntax-highlighted code editor with IDE keyboard shortcuts. Uses [Shiki](https://shiki.style/) for highlighting with a transparent textarea overlay for editing.

## Quick Reference

```tsx
import { CodeEditor } from "@uiid/code";

// Basic usage
<CodeEditor defaultValue="const x = 1;" language="typescript" />

// With header
<CodeEditor defaultValue={code} filename="app.tsx" copyable />

// Controlled
<CodeEditor value={code} onValueChange={setCode} />

// Options
<CodeEditor showLineNumbers readOnly disabled />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Controlled value |
| `defaultValue` | `string` | `""` | Initial value (uncontrolled) |
| `onValueChange` | `(value: string) => void` | — | Callback when value changes |
| `language` | `BundledLanguage` | `"typescript"` | Syntax highlighting language |
| `showLineNumbers` | `boolean` | `false` | Show line numbers |
| `readOnly` | `boolean` | `false` | Make editor read-only |
| `disabled` | `boolean` | `false` | Disable the editor |
| `placeholder` | `string` | — | Placeholder when empty |
| `filename` | `string` | — | Filename for header |
| `copyable` | `boolean` | `true` | Show copy button |
| `tabSize` | `number` | `2` | Spaces per tab |
| `insertSpaces` | `boolean` | `true` | Use spaces instead of tabs |
| `fullwidth` | `boolean` | `false` | Full width layout |
| `HeaderProps` | `CodeBlockHeaderProps` | — | Props for header |
| `CopyButtonProps` | `CodeBlockCopyButtonProps` | — | Props for copy button |

> `BundledLanguage` = `"javascript" | "typescript" | "jsx" | "tsx" | "json" | "css" | "html" | "bash" | "markdown" | "python"`

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Insert indentation |
| `Shift+Tab` | Remove indentation |
| `Enter` | New line with auto-indent |
| `Cmd/Ctrl+D` | Duplicate current line |
| `Cmd/Ctrl+/` | Toggle line comment |
| `Cmd/Ctrl+]` | Indent line |
| `Cmd/Ctrl+[` | Dedent line |

## Data Slots

| Slot | Element |
|------|---------|
| `code-editor` | Root container |
| `code-editor-highlight` | Highlighted code backdrop |
| `code-editor-textarea` | Textarea overlay |

## Architecture

The editor uses a transparent `<textarea>` overlaid on syntax-highlighted code via the `Layer` component:

```
┌─ CodeEditor (Stack) ─────────────────┐
│ ┌─ CodeBlockHeader ────────────────┐ │
│ │ filename.tsx          [Copy]     │ │
│ └──────────────────────────────────┘ │
│ ┌─ Layer (CSS Grid overlay) ───────┐ │
│ │ ┌─ Highlighted HTML (backdrop) ─┐ │ │
│ │ │ const x = 1;                  │ │ │
│ │ └───────────────────────────────┘ │ │
│ │ ┌─ Textarea (transparent) ──────┐ │ │
│ │ │ [user edits here]             │ │ │
│ │ └───────────────────────────────┘ │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

## See Also

- [CodeBlock](../code-block/README.md) - Read-only code display
- [CodeInline](../code-inline/README.md) - Inline code highlighting
