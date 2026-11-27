# CodePreview

> A live example with its source beneath it, in one frame. The example renders in a canvas, and a "Show code" footer below it opens the code between them. The code's copy button floats in its top-right corner, as on a CodeBlock.

```tsx
import { CodePreview } from "@uiid/code";

<CodePreview code={source} html={html} language="tsx">
  <Examples.Variants />
</CodePreview>;
```

Use CodePreview when you want to:

- Show a rendered example and let readers open its source, as the docs site does for every component example
- Let readers replay an example that animates on load, or clear state they changed, with `resettable`
- Number the lines with `showLineNumbers` or mark them with `highlightLines` (1-indexed), as on CodeBlock

`children` is the live example and `code` is its source. With no `code` (or an empty string) there is no code and no footer, and the component is a framed canvas. The copy button renders by default, floating over the open code; `copyable={false}` leaves it out, and it is never shown disabled. It is part of the code, so it is reachable only while the code is open. `onCopy` fires after a successful copy. `showLabel` and `hideLabel` replace the footer's "Show code" and "Hide code".

The frame is a CodeBlock frame: its border, radius and code surface are CodeBlock's own. Top to bottom it holds the canvas, the code panel while it is open, and the footer toggle. The code panel is a UIID `Collapsible` panel, and the code inside it is `CodeBlockContent`, the same highlighted code a CodeBlock draws, with no second border or radius. The canvas has a surface of its own, a step from the page toward the theme's surface, so the example and its source read as two zones of one object, with one rule between the canvas and what follows it.

The footer is CodeBlock's expand toggle, the "Show more" strip a CodeBlock with `rows` shows: full width, its text centred, muted until hover or focus, on the theme's surface, its bottom corners following the frame's. It is a button whose `aria-expanded` follows the panel and whose `aria-controls` names it while open.

## Size

The frame sizes to fit its widest zone, the code included, and never grows past its parent. An example wider than the frame scrolls inside the canvas, and a long line scrolls inside the code, so neither widens the frame. Inside a parent that sizes to fit, such as a `Card`, the frame stops at the width the parent has.

The canvas is at least 7.5rem tall, padding included, and grows with a taller example. The example is centred on both axes with `safe center`: one wider or taller than the canvas starts at the canvas's start edge instead, so scrolling reaches all of it. Layout props reach the canvas through `CanvasProps`: `ax` and `ay` replace the centring, and `p` replaces the padding. The minimum height is replaced by `minh` only, in pixels: an `h` smaller than 7.5rem on its own does not take the canvas below the minimum. `CanvasProps={{ ax: "start", p: 4, minh: 80 }}` aligns to the start, pads and lowers the minimum to 80px.

## Highlighting

Pass `html` from `highlight()` to render pre-highlighted code: Shiki is never loaded on the client. Without `html`, the code highlights on the client the first time the panel opens, and never if it stays closed, so a page full of closed previews loads no highlighter. Until the highlight lands the code shows unhighlighted in the same layout, so nothing in the frame moves when it does.

```tsx
import { CodePreview, highlight } from "@uiid/code";

const html = await highlight(source, "tsx");

<CodePreview code={source} html={html} language="tsx">
  <Example />
</CodePreview>;
```

## Open state

The panel is closed by default. `defaultOpen` starts it open. Set `open` to control it: the footer then only asks for a change through `onOpenChange`, which receives the next state and Base UI's event details, as on `Collapsible`.

The code is mounted from the first render and stays mounted while closed, so it sets the frame's width either way and the frame keeps its width as the code opens and closes. A closed panel takes no height and is hidden, its copy button included: out of sight, out of the tab order, out of the accessibility tree and out of the browser's find-in-page. The panel opens and closes with the `Collapsible` animation, and snaps under `prefers-reduced-motion`.

## Reset

`resettable` adds a reset button, named "Reset preview", in the canvas's top-right corner. It is off by default, and off it is not in the DOM. It is a small, square `subtle` button, so its fill and border set it apart from the example behind it, and its icon is muted until it is hovered or focused. It is placed from the frame rather than inside the canvas, so it stays in the corner while a wide example scrolls. At the default padding the canvas keeps room for it above the example, and as much below so the example stays centred. The room counts toward the canvas's minimum height rather than adding to it, and a padding set through `CanvasProps` replaces it. Its string tooltip is its name, so a string `tooltip` through `ResetButtonProps` renames it to the text it shows. A tooltip that is not a string, or a shape that is not square or circle, would leave it unnamed, so it is named "Reset preview" then; an `aria-label` there renames it either way. Pressing it remounts `children`: load animations replay and any state inside the example returns to its start. It does not open or close the code, and focus ends on the button wherever it was, including inside a popover or dialog the example opened. `onReset` fires on each press, before the example remounts.

The remount is a `key` change on a wrapper around `children`. It remounts the elements it was given and never calls `children`, which is the shape `children` take when a server component renders them.

An example that opens a portal, such as a popover or a dialog, renders it outside the frame, so the frame's clip does not cut it off. Reset closes it, since the example that opened it remounts. A dialog's backdrop covers the reset button while the dialog is open, so it is closed there first, or, when it is not modal, reset is reached from the keyboard.

## Errors

An example that throws while rendering does not take the page down. The canvas shows "This example failed to render." in place of the example, and the frame, code and footer still render. With `resettable` on, reset is the retry. The message is fixed and announced as a status: the thrown error is not shown, and React reports it to the console by default.

## Slots

Each part takes its own props through a slot on CodePreview: `CanvasProps`, `TriggerProps` (the footer), `PanelProps`, `ResetButtonProps`, `CopyButtonProps` (the floating copy button) and `ContentProps`. A slot leaves out what CodePreview sets itself, so the footer's labels, the code, its highlighting, its line numbers, the reset button's `onClick` and the copy button's `code` and `onCopy` can only be set on CodePreview. The canvas is a `Stack`, so it takes layout props: `CanvasProps={{ ax: "start", p: 4 }}`.

## Parts

`CodePreviewRoot`, `CodePreviewCanvas`, `CodePreviewPanel`, `CodePreviewTrigger` and `CodePreviewResetButton` are exported for composition, and each carries its own look: the root is the CodeBlock frame, a `CollapsibleRoot`, the canvas paints the example's zone, the panel holds the code, and the trigger is the footer. The panel stays mounted while closed, as in CodePreview, and keeps the frame's width inside `CodePreviewRoot`. Put a `CodeBlockHeader` with `code` and no filename in the panel to float the copy button over the code, and `CodeBlockContent` after it for the code; pass it `html` from `useHighlight` (or `highlight()` on the server) to color it. Composed, the reset button is only a subtle button in the flow: placing it and remounting the example on its `onClick` are up to you.

```tsx
const { html } = useHighlight(source, "tsx");

<CodePreviewRoot>
  <CodePreviewCanvas>
    <Example />
  </CodePreviewCanvas>
  <CodePreviewPanel>
    <CodeBlockHeader code={source} />
    <CodeBlockContent code={source} html={html || undefined} />
  </CodePreviewPanel>
  <CodePreviewTrigger />
</CodePreviewRoot>;
```

`useHighlight` here highlights on mount. CodePreview waits for the first open instead.

The canvas and the panel are sibling parts under one root, so a different arrangement of the same parts can be added later.
