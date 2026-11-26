# CodePreview

> A live example with its source beneath it, in one frame. The example renders in a canvas, and a bar below it holds a "Show code" trigger and a copy button. The code is closed until the trigger opens it.

```tsx
import { CodePreview } from "@uiid/code";

<CodePreview code={source} html={html} language="tsx">
  <Examples.Variants />
</CodePreview>;
```

Use CodePreview when you want to:

- Show a rendered example and let readers open its source, as the docs site does for every component example
- Copy the source without opening it: the copy button in the bar works whether the code is open or closed
- Let readers replay an example that animates on load, or clear state they changed, with `resettable`
- Number the lines with `showLineNumbers` or mark them with `highlightLines` (1-indexed), as on CodeBlock

`children` is the live example and `code` is its source. With no `code` (or an empty string) there is no bar and no panel, and the component is a framed canvas. The copy button renders by default; `copyable={false}` leaves it out, and it is never shown disabled. `onCopy` fires after a successful copy. `showLabel` and `hideLabel` replace the trigger's "Show code" and "Hide code".

The code panel is a UIID `Collapsible` panel, and the code inside it is `CodeBlockContent`, the same highlighted code a CodeBlock draws, with no second border, radius or header. The frame's single border and radius hold the canvas, the bar and the code.

## Highlighting

Pass `html` from `highlight()` to render pre-highlighted code: Shiki is never loaded on the client. Without `html`, the code highlights on the client the first time the panel opens, and never if it stays closed, so a page full of closed previews loads no highlighter. Until the highlight lands the code shows unhighlighted in the same layout.

```tsx
import { CodePreview, highlight } from "@uiid/code";

const html = await highlight(source, "tsx");

<CodePreview code={source} html={html} language="tsx">
  <Example />
</CodePreview>;
```

## Open state

The panel is closed by default. `defaultOpen` starts it open. Set `open` to control it: the trigger then only asks for a change through `onOpenChange`, which receives the next state and Base UI's event details, as on `Collapsible`. Collapsed code is not in the DOM, so the browser's find-in-page does not reach it.

## Reset

`resettable` adds a reset button, named "Reset preview", in the canvas's top-right corner. It is off by default, and off it is not in the DOM. Pressing it remounts `children`: load animations replay and any state inside the example returns to its start. It does not open or close the code, and focus stays on the button, or moves to it if it was inside the example. `onReset` fires on each press, before the example remounts.

The remount is a `key` change on a wrapper around `children`. It remounts the elements it was given and never calls `children`, which is the shape `children` take when a server component renders them.

## Errors

An example that throws while rendering does not take the page down. The canvas shows "This example failed to render." in place of the example, and the frame, bar and code still render. With `resettable` on, reset is the retry. The message is fixed and announced as a status: the thrown error is not shown, and React reports it to the console by default.

## Slots

Each part takes its own props through a slot on CodePreview: `CanvasProps`, `BarProps`, `TriggerProps`, `PanelProps`, `ResetButtonProps`, `CopyButtonProps` and `ContentProps`. A slot leaves out what CodePreview sets itself, so the trigger's labels, the code, its highlighting, its line numbers, the reset button's `onClick` and the copy button's `code` and `onCopy` can only be set on CodePreview. The canvas is a `Stack` and the bar a `Group`, so both take layout props: `CanvasProps={{ ax: "start", p: 4 }}`.

## Parts

`CodePreviewCanvas`, `CodePreviewBar`, `CodePreviewTrigger`, `CodePreviewPanel` and `CodePreviewResetButton` are exported for composition. Composed, the reset button is only a button in the flow: placing it and remounting the example on its `onClick` are up to you. The trigger and the panel need a `CollapsibleRoot` from `@uiid/interactive` around them; the copy button is `CodeBlockCopyButton` and the code is `CodeBlockContent`. Composed this way there is no frame and no highlighting, which CodePreview adds.

```tsx
<CollapsibleRoot>
  <CodePreviewCanvas>
    <Example />
  </CodePreviewCanvas>
  <CodePreviewBar>
    <CodePreviewTrigger />
    <CodeBlockCopyButton code={source} />
  </CodePreviewBar>
  <CodePreviewPanel>
    <CodeBlockContent code={source} />
  </CodePreviewPanel>
</CollapsibleRoot>
```

The canvas and the panel are sibling parts under one root, so a different arrangement of the same parts can be added later.
