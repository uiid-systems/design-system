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

| Prop              | Type                                                  | Default        | Description                  |
| ----------------- | ----------------------------------------------------- | -------------- | ---------------------------- |
| `value`           | `string`                                              | —              | Controlled value             |
| `defaultValue`    | `string`                                              | `""`           | Initial value (uncontrolled) |
| `onValueChange`   | `(value: string) => void`                             | —              | Callback when value changes  |
| `language`        | `CodeLanguage`                                        | `"typescript"` | Syntax highlighting language |
| `showLineNumbers` | `boolean`                                             | `false`        | Show line numbers            |
| `readOnly`        | `boolean`                                             | `false`        | Make editor read-only        |
| `disabled`        | `boolean`                                             | `false`        | Disable the editor           |
| `placeholder`     | `string`                                              | —              | Placeholder when empty       |
| `rows`            | `number`                                              | —              | Maximum visible rows         |
| `filename`        | `string`                                              | —              | Filename for header          |
| `copyable`        | `boolean`                                             | `true`         | Show copy button             |
| `HeaderProps`     | `CodeBlockHeaderProps`, less the keys CodeEditor sets | —              | Props for header             |
| `CopyButtonProps` | `CodeBlockCopyButtonProps`, less `code`               | —              | Props for copy button        |
| `TextareaProps`   | `CodeEditorTextareaProps`                             | —              | Props for the textarea       |

The copy button is left out while the value is empty, rather than shown disabled, and appears once there is something to copy. The header follows CodeBlock's rule: a bar is drawn when there is a `filename` (or a `HeaderProps.language` icon or children), including while the value is empty. With none of them there is no bar, and the copy button floats in the top-right corner over the code, out of the flow, so the textarea never moves as it comes and goes; every line of the editor keeps the button's width clear, since a textarea cannot pad its first line alone, so beside a CodeBlock the editor's later lines wrap one button's width sooner.

The editor wears CodeBlock's frame: the same border, radius and editor-theme surface, with the same header, padding, line-number gutter and typography, so a block and an editor stacked together line up. Focus on the textarea draws the focus ring around the frame. The code stays on the editor theme's surface in every state, since the token colours are tuned for it. Read-only dashes the frame's border and disabled dims the whole frame; the root carries `data-readonly` and `data-disabled` for each. The dashed border is a visual cue only: assistive technology reads the textarea's native `readonly`, so no `aria-readonly` is needed.

`HeaderProps` takes the header's own layout and element props. `filename`, `copyable`, the copied code (the editor's value) and `CopyButtonProps` are set on CodeEditor, so passing one through `HeaderProps` is a type error. The wrap and fullscreen keys are left out too, since the editor has neither button. At runtime CodeEditor's value wins, for `filename` only when it is set. The header shows no language icon unless `HeaderProps.language` names one, such as `HeaderProps={{ language: "python" }}`; that icon is independent of the top-level `language`, which only picks the highlighting.

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

> `CodeLanguage` = `BundledLanguage | (string & {})`, where `BundledLanguage` = `"javascript" | "typescript" | "jsx" | "tsx" | "json" | "css" | "html" | "bash" | "markdown" | "python"`. Aliases (`js`, `ts`, `sh`, `shell`, `zsh`, `py`, `md`) resolve to a bundled language; any other name renders as plain, uncolored code.

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

The textarea's own text is transparent, so the backdrop must always hold exactly the textarea's text. A highlight lands one pass after the value changes; until the markup for the current value arrives, the backdrop paints the value as plain text in Shiki's line structure (and carries `data-pending`), so a typed or pasted character shows in the frame it is typed and the caret never sits over different text. Notation comments such as `// [!code ++]` stay in the code as typed, rather than being turned into diff or highlight lines as CodeBlock does. With `rows` the layer is capped at that many lines and scrolls as one, so the textarea never scrolls on its own; without it the editor grows with its content.

## See Also

- [CodeBlock](../code-block/README.md) - Read-only code display
- [CodeInline](../code-inline/README.md) - Inline code highlighting
