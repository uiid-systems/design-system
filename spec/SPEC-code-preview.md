# Spec: code-preview — V1

Milestone 2. Depends on `code-block`. Inherits the shared conventions in `spec/capability-map-code.md`.

## Objective

A new published component, `CodePreview`, in `@uiid/code`. It shows a live example and its source as one unit: the example on top, the code collapsed beneath it. It is what the docs site uses for every component example, and it works anywhere else a rendered example needs its source beside it.

```
┌──────────────────────────┐
│                      [↻] │
│        children          │
│                          │
├──────────────────────────┤
│ ▸ Show code         [⧉]  │
└──────────────────────────┘
```

## Usage

```tsx
<CodePreview code={source} html={html} language="tsx" resettable>
  <Examples.Reveal />
</CodePreview>
```

## Requirements

### Structure

1. One frame with one border and one radius: a canvas holding `children`, then a bar, then the code panel.
2. The canvas is a `Stack` with padding and takes layout props through `CanvasProps` (alignment, padding, min height). Content wider than the canvas scrolls inside it and never widens the frame.
3. The bar holds the "Show code" trigger on the left and the copy button on the right. Copy works whether the code is open or closed.
4. The code panel is a UIID `Collapsible` panel. Open, it shows the code through `CodeBlockContent` with no second border, radius or header: no frame inside the frame.
5. The code is closed by default.

### Props

6. `children` is the live example. `code` is its source. `html` is optional pre-highlighted markup; without it the code highlights on the client the first time the panel opens, and never if it stays closed.
7. `language`, `showLineNumbers` and `highlightLines` pass through to the code.
8. `open`, `defaultOpen` and `onOpenChange` control the code panel, mirroring `Collapsible`.
9. `copyable` defaults to `true`. The copy button is not rendered when it is off or `code` is empty. `onCopy` fires after a successful copy.
10. `resettable` defaults to `false`. When on, a reset button renders in the canvas's top-right corner. When off, it is not in the DOM.
11. `showLabel` and `hideLabel` set the trigger text, defaulting to "Show code" and "Hide code".
12. With no `code`, the bar and panel do not render: the component is a framed canvas, with the reset button if asked for.

### Reset

13. Pressing reset remounts `children`: load animations replay and all state inside the example returns to its start.
14. Reset does not close or reopen the code panel and does not move focus off the reset button.
15. `onReset` fires after each reset.
16. Reset works when `children` come from a server component.

### API shape

17. Parts exported with their prop types: `CodePreview`, `CodePreviewCanvas`, `CodePreviewBar`, `CodePreviewTrigger`, `CodePreviewPanel`, `CodePreviewResetButton`. The copy button is the existing `CodeBlockCopyButton`.
18. Slots on `CodePreview`: `CanvasProps`, `BarProps`, `TriggerProps`, `PanelProps`, `ResetButtonProps`, `CopyButtonProps`, `ContentProps`. Each omits owned keys.
19. **Room for tabs.** The canvas and the code panel are sibling parts under one root, and nothing in the public types says the code must be below or collapsible. Milestone 4 can add a tabbed arrangement as an additive prop without changing these parts.

### Look and feel

20. The frame, border, radius and surface match `CodeBlock`, so a preview and a plain block on the same page look like one family.
21. The canvas has a background distinct from the code surface, so the example and its source read as two zones of one object.
22. The reset button is quiet: ghost, small, muted until hover or focus. It never overlaps the example's content at the default padding.
23. The panel opens with the `Collapsible` animation and respects `prefers-reduced-motion`.

### Robustness

24. Robustness matches `code-block` requirements 16–20: no shift when highlighting lands, long lines scroll inside, no page overflow at 320px, theme changes recolor in place, and it renders correctly nested in `Card` and `Dialog`.
25. An example that renders a portal (a dialog, popover or toast) works inside the canvas, and reset closes it.
26. An example that throws on render does not take the page down with it: the frame, bar and code still render. See open question 2.
27. Accessibility: the trigger is a button with `aria-expanded` tied to the panel, the reset button is named "Reset preview", and the code region follows `code-block` requirement 21.

## Testing strategy

- Unit tests cover 5–19 and 27, including a child that counts its mounts to prove reset remounts.
- `code-preview.browser.test.tsx` covers 2, 4, 24 and 25, and checks that a CSS load animation replays after reset.
- Stories: default, open by default, resettable with an animated child, no code, wide child, tall child, long code, nested in a Card, both themes.

## Boundaries

Deltas only.

- `@uiid/code` gains `@uiid/interactive` as a dependency. This is approved.
- **Ask first:** changing `Collapsible` in `@uiid/interactive` to make it fit.

## Success criteria

- [ ] `<CodePreview code="x">…</CodePreview>` renders a canvas, a bar with a trigger and one copy button, and no reset button.
- [ ] A mount-counting child reports 2 after one reset, and the panel's open state is unchanged.
- [ ] With `html` set, opening the panel loads no Shiki chunk.
- [ ] With the panel never opened and no `html`, no Shiki chunk loads.
- [ ] `packages/code/src/index.test.ts` lists the six new parts and their prop types.
- [ ] Unit and browser tests pass, and `pnpm size` passes or the growth is stated and approved.
- [ ] The owner has looked at the stories and accepted the look.

## Out of scope (deferred)

- Preview/Code tabs: milestone 4.
- Editing the code to change the preview.
- Viewport controls (phone, tablet, desktop widths) and a theme toggle on the canvas.
- "Open in" links to external sandboxes.
- A title or description row on the frame. Docs render their own heading.

## Open questions

1. **Find-in-page.** Collapsed code is not in the DOM, so the browser's page search cannot find it. Base UI's `hiddenUntilFound` would fix that at the cost of always rendering the markup. Recommendation: leave it off in V1 and revisit with real docs pages.
2. **Error boundary (requirement 26).** Should `CodePreview` ship its own error boundary around `children`, showing a short message in the canvas with reset as the retry? Recommendation: yes, since reset is already a natural retry.
3. **Long code when open.** Does the open panel show all the code, or cap it with `rows` and "Show more" as docs do today at 8 rows? Recommendation: show all of it by default and pass `rows` through for callers who want a cap. A second expand control inside an expanded panel is one control too many.
