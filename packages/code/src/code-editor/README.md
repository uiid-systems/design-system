# CodeEditor

> Syntax-highlighted code editor using [Shiki](https://shiki.style/) for highlighting with a transparent textarea overlay for editing.

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

// Label, name or ref the textarea
<CodeEditor TextareaProps={{ "aria-label": "Request body", name: "body", ref }} />
```

## Props

| Prop              | Type                       | Default        | Description                  |
| ----------------- | -------------------------- | -------------- | ---------------------------- |
| `value`           | `string`                   | —              | Controlled value             |
| `defaultValue`    | `string`                   | `""`           | Initial value (uncontrolled) |
| `onValueChange`   | `(value: string) => void`  | —              | Callback when value changes  |
| `language`        | `BundledLanguage`          | `"typescript"` | Syntax highlighting language |
| `showLineNumbers` | `boolean`                  | `false`        | Show line numbers            |
| `readOnly`        | `boolean`                  | `false`        | Make editor read-only        |
| `disabled`        | `boolean`                  | `false`        | Disable the editor           |
| `placeholder`     | `string`                   | —              | Placeholder when empty       |
| `filename`        | `string`                   | —              | Filename for header          |
| `copyable`        | `boolean`                  | `true`         | Show copy button             |
| `HeaderProps`     | `CodeBlockHeaderProps`     | —              | Props for header             |
| `CopyButtonProps` | `CodeBlockCopyButtonProps` | —              | Props for copy button        |
| `TextareaProps`   | `CodeEditorTextareaProps`  | —              | Props for the textarea       |

`TextareaProps` reaches the `<textarea>` itself, so it is where `name`, `id`, `ref`, `onBlur` and `aria-*` go; a top-level `ref` or `aria-label` still lands on the root container. The textarea is named "Code editor", or "{filename} code editor" when `filename` is set, unless `TextareaProps` carries an `aria-label` or `aria-labelledby`. `value`, `defaultValue`, `readOnly`, `disabled` and `placeholder` stay top-level props, and `onChange` and `onScroll` run after the editor's own handlers.

The default name applies whenever the caller supplies neither `aria-label` nor `aria-labelledby`, including when a native `<label htmlFor>` or a `Field` label is present, because `aria-label` outranks both. A `Field` label also points at a generated id the textarea never receives, so wrapping the editor in `<Field label>` does not name it on its own. To hand naming to a visible label, point the textarea at the label's id:

```tsx
<label id="body-label">Request body</label>
<CodeEditor TextareaProps={{ "aria-labelledby": "body-label" }} />

// Inside a Field, give its label the id
<Field label="Request body" LabelProps={{ id: "body-label" }}>
  <CodeEditor TextareaProps={{ "aria-labelledby": "body-label" }} />
</Field>
```

To name it with `<label htmlFor>` instead, pass the matching `id` and drop the default: `TextareaProps={{ id: "body", "aria-label": undefined }}`.

> `BundledLanguage` = `"javascript" | "typescript" | "jsx" | "tsx" | "json" | "css" | "html" | "bash" | "markdown" | "python"`

## Data Slots

| Slot                    | Element                   |
| ----------------------- | ------------------------- |
| `code-editor`           | Root container            |
| `code-editor-highlight` | Highlighted code backdrop |
| `code-editor-textarea`  | Textarea overlay          |

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
