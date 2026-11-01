# Spec: `interactive-trace`

**Module:** `interactive-trace` (see [capability map](./capability-map.md), wave 2)
**Package:** `@uiid/interactive`
**Status:** Proposed
**Upstream:** shadcn/ui `trace` at the `base-nova` registry (`https://ui.shadcn.com/r/styles/base-nova/trace.json`, fetched 2026-11-01), documented at `https://ui.shadcn.com/docs/components/base/trace`
**Depends on:** nothing in the map. `Collapsible` from this package, `Text` and `Shimmer` from `@uiid/typography`

## Objective

`Trace` is the list of steps an agent took: one row per step with an icon, a one-line title, an optional description such as a count or a duration, and a status. A row can be plain text, a link, or a collapsible that opens into detail, and that detail can be another `Trace`, so a summary opens into steps and a step opens into its output.

It is the primitive under the second wave of AI Elements. When shadcn relaunched the set in 2026, ten of its twenty-one patterns were rebuilt on this one component: Chain of Thought, Task, Plan, Sources, Subagent, Queue, Terminal, Test Results, Stack Trace and Tool. Each of those is a few rows of `Trace` around a data shape from the AI SDK. Building the primitive once means each of them is a small module, and it gives `Reasoning` and `Tool` a row anatomy to share instead of `packages/ai/src/shared/collapsible-trigger.module.css`.

It lives in `@uiid/interactive` next to `Collapsible`, which it is built on, by the rule that sent `Shimmer` to `@uiid/typography`: a dependency-free thing with nothing AI-specific about it lives in its general package. A file tree, a changelog, a build log and a CI run all read as a trace. `Timeline` in `@uiid/indicators` is not a substitute: every `Timeline` item is a `Card` on a marker rail, and a trace is a dense register of plain text rows with no surface and no rail between them.

**Acceptance criteria:**

- `<Trace>` renders a column of rows. `<TraceLine>` is one row, a `Group` of its children with `gap={2}` and `ay="center"`, rendered as a `span` so it is valid inside a `button` or an `a`. It takes `status`: `"running"`, `"error"` or `"pending"`, and unset means done. The status is written as `data-status`.
- `<TraceTitle>` is a `Text` that truncates to one line. Inside a line whose status is `running`, a string title renders through `Shimmer`; otherwise it renders as `Text`. `<TraceDescription>` is a `Text` that never truncates or wraps and never shimmers. `<TraceIcon>` is a `span` hidden from assistive technology that sizes an `svg` to the global icon size and never shrinks.
- `<TraceCollapsible>` is `CollapsibleRoot`, `<TraceCollapsibleTrigger>` is `CollapsibleTrigger` rendered as a `TraceLine` with a chevron appended, and `<TraceCollapsiblePanel>` is `CollapsiblePanel` indented under the icon with a rule down its start edge. Every Base UI Collapsible prop passes through unchanged: `open`, `defaultOpen`, `onOpenChange` and `disabled` on the root, `keepMounted` and `hiddenUntilFound` on the panel. The trigger takes `status` and hands it to its line.
- The trigger is a `role="button"` with `aria-expanded`, toggled by click, Enter and Space, with the chevron turned a quarter while open. A panel with `keepMounted` keeps a nested `TraceCollapsible`'s open state while its parent is closed.
- A row reads in the muted shade and lifts to the foreground shade when it is, or is inside, a hovered anchor, button or `role="button"`. An `error` row reads in the red palette, on hover too. A `pending` row is dimmed. A `running` row's title shimmers, and stays still under `prefers-reduced-motion`.
- Every part writes a `data-slot`: `trace`, `trace-line`, `trace-icon`, `trace-title`, `trace-description`, `trace-collapsible`, `trace-collapsible-trigger`, `trace-collapsible-panel`. Every part forwards `className`, `ref` and its base component's props.
- `packages/interactive/package.json` moves `@uiid/typography` from `devDependencies` to `dependencies`. `pnpm size` passes for `@uiid/interactive` at its existing `60 kB` limit.

## API

```ts
// trace.types.ts
import type { StackProps, GroupProps } from "@uiid/layout";
import type { TextProps } from "@uiid/typography";

import type {
  CollapsiblePanelProps,
  CollapsibleRootProps,
  CollapsibleTriggerProps,
} from "../collapsible/collapsible.types";

/** The state of one step. Unset means the step is done. */
export type TraceStatus = "running" | "error" | "pending";

/** The list. */
export type TraceProps = StackProps;

/** One row: an icon, a title, a description, in a `span`. */
export type TraceLineProps = GroupProps & {
  status?: TraceStatus;
};

/** A decorative icon slot, hidden from assistive technology. */
export type TraceIconProps = React.ComponentProps<"span">;

/** One line of text that truncates, and shimmers while its row runs. */
export type TraceTitleProps = TextProps;

/** Secondary text that never truncates: a count, a duration, a diff stat. */
export type TraceDescriptionProps = TextProps;

/** A row that opens. Base UI's Collapsible root on a `Stack`. */
export type TraceCollapsibleProps = CollapsibleRootProps;

/**
 * The row that toggles it. It is the `TraceLine`, so it takes the line's
 * `status` and the trigger's remaining props; the element is the line.
 */
export type TraceCollapsibleTriggerProps = Omit<
  CollapsibleTriggerProps,
  "children" | "render" | "nativeButton"
> & {
  status?: TraceStatus;
  children?: React.ReactNode;
};

/** The detail under a row, indented under its icon. */
export type TraceCollapsiblePanelProps = CollapsiblePanelProps;
```

The names are shadcn's, so a reader of its AI Elements pages finds the same parts here, with one exception: `TraceCollapsiblePanel`, not `TraceCollapsibleContent`, because Base UI and this package call it a panel. The status vocabulary is shadcn's exactly, since every wave 2 pattern maps its data onto it: `running` while a part streams, `error` on `output-error`, `pending` for a plan step not yet started, unset for done.

Usage, which is a source list the way the Sources pattern renders it:

```tsx
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleTrigger,
  TraceCollapsiblePanel,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@uiid/interactive";
import { GlobeIcon } from "@uiid/icons/globe";

<Trace>
  <TraceCollapsible>
    <TraceCollapsibleTrigger>
      <TraceIcon>
        <GlobeIcon />
      </TraceIcon>
      <TraceTitle>Used 3 sources</TraceTitle>
    </TraceCollapsibleTrigger>
    <TraceCollapsiblePanel>
      <Trace>
        {sources.map((source) => (
          <a
            key={source.url}
            href={source.url}
            target="_blank"
            rel="noreferrer"
          >
            <TraceLine>
              <TraceTitle>{source.title}</TraceTitle>
            </TraceLine>
          </a>
        ))}
      </Trace>
    </TraceCollapsiblePanel>
  </TraceCollapsible>
</Trace>;
```

A step list with status, which is the Task pattern's shape:

```tsx
<Trace>
  <TraceLine>
    <TraceIcon>
      <SearchIcon />
    </TraceIcon>
    <TraceTitle>Searched the codebase</TraceTitle>
    <TraceDescription>12 files</TraceDescription>
  </TraceLine>
  <TraceLine status="running">
    <TraceIcon>
      <FileTextIcon />
    </TraceIcon>
    <TraceTitle>Reading packages/ai/src/tool/tool.tsx</TraceTitle>
  </TraceLine>
  <TraceLine status="pending">
    <TraceIcon>
      <CircleDashedIcon />
    </TraceIcon>
    <TraceTitle>Write the test</TraceTitle>
  </TraceLine>
</Trace>
```

Exports from the barrel: the eight parts and their props types, and `TraceStatus`.

## Implementation notes

### Structure

```
[data-slot=trace]                                  Stack, gap 2, ax start, fullwidth
  [data-slot=trace-line][data-status]              Group as span, gap 2, ay center
    [data-slot=trace-icon]                         span, aria-hidden
    [data-slot=trace-title]                        Text, truncate; Shimmer while running
    [data-slot=trace-description]                  Text, nowrap
  [data-slot=trace-collapsible]                    CollapsibleRoot, Stack, ax start, fullwidth
    [data-slot=trace-collapsible-trigger][data-status]   CollapsibleTrigger rendered as TraceLine, role button
      …the line's children
      [data-slot=trace-icon] ChevronRightIcon      turned while open
    [data-slot=trace-collapsible-panel]            CollapsiblePanel, Stack, ax stretch, fullwidth, animated
      …any content, often another Trace
```

**Root.** `Trace` is a `Stack` with `gap={2}`, `ax="start"` and `fullwidth` as defaults. Start alignment is what lets each row hug its content so a hover or focus ring fits the text, and `fullwidth` is so a nested `Trace` fills its panel. A trace is content, not a landmark, so it carries no role; an `ol` would announce a count for what is often a single row.

**Line.** `TraceLine` is a `Group` with `gap={2}`, `ay="center"` and `render={<span />}` as defaults, `data-status` from `status`, and the module class. Each default is destructured and passed on rather than written as a literal on the element, so a caller's value wins. A `span` because a line sits inside a `button` or an `a` as often as it stands alone, and only phrasing content is valid there. The module gives it the muted shade, `min-width: 0` and `max-width: 100%` so the title can truncate, and the hover, error and pending rules below. On `error` it also wears `paletteColorStyles.red` from `@uiid/tokens` and paints `color: var(--palette-text)`, which is how `Text` paints a `color`. No `cva`: the three statuses change a color and an opacity, which are three attribute rules, and a variants file would say the same thing twice.

**Status to the title.** `TraceLine` provides its `status` through a `TraceLineContext`, one optional value, and `TraceTitle` reads it. That is the only context in the module and it carries nothing else. shadcn does this with a descendant selector and a `shimmer` utility class; here the shimmer is a component whose band is sized from the text's length, so the title has to choose its element. When the status is `running` and `children` is a string, `TraceTitle` renders `<Shimmer truncate {...props}>`; otherwise `<Text truncate {...props}>`. A non-string title in a running row renders still, since `Shimmer` only takes a string. `truncate` is a destructured default, so `truncate={false}` turns it off. `Text` trims sizes 2 and up and `Shimmer` already undoes that for its own box; a trace title takes no `size`, so it inherits the line's.

**Description.** `TraceDescription` is a `Text` with `nowrap` as a default and the module class: `flex-shrink: 0`, `font-variant-numeric: tabular-nums` so a changing duration does not jitter, and `opacity: 0.7` so it reads one step quieter than the title and lifts with the row on hover, which is upstream's `text-muted-foreground/70` without a second color.

**Icon.** `TraceIcon` is a plain `span` with `aria-hidden="true"` and the module class: `display: inline-flex`, centered, `flex-shrink: 0`, and an `svg` sized to `var(--globals-icon-size)`. Placed before the title it names the step; placed after, it is an indicator. The accessible name of a row is its title text, so the icon is decoration by design.

**Collapsible.** `TraceCollapsible` is `CollapsibleRoot` with `ax="start"` and `fullwidth`, the same shape as the `Trace` root, so the trigger hugs its text while the panel spans the row. `TraceCollapsibleTrigger` is `CollapsibleTrigger` with `nativeButton={false}` and `render={<TraceLine status={status} />}`: the line is the button, so Base UI gives it `role="button"`, `tabIndex`, `aria-expanded` and the keys, exactly the pattern `Reasoning` and `Tool` use with a `Group`. Its `children` are the line's content, and it appends `<TraceIcon><ChevronRightIcon /></TraceIcon>` from `@uiid/icons/chevron-right`, with a module class that turns it 90 degrees under `[data-panel-open]`, which Base UI writes on the trigger while the panel is open. `render` and `nativeButton` are omitted from its props because the element is the line by definition; a row that opens something other than a panel wraps a plain `TraceLine` in its own trigger instead. Not a `Button`: a trace row is text that happens to be pressable, and a `Button` brings a surface, padding and a height that would all be turned off. The module adds `cursor: pointer`, and on `:focus-visible` the global outline tokens with the global radius, so the ring has corners around the text.

**Panel.** `TraceCollapsiblePanel` is `CollapsiblePanel` with `instant={false}`, `ax="stretch"`, `fullwidth`, `pl={4}`, `pt={2}` and `pb={1}` as defaults, and the module class drawing the rule: `border-inline-start: var(--globals-border-width) solid var(--globals-border-color)` with `margin-inline-start: calc(var(--globals-icon-size) / 2 - var(--globals-border-width) / 2)`, so the rule runs down from the center of the icon above it. The spacing is style props and the arithmetic is in the module, by the token rule. `ax="stretch"` so a nested `Trace` or a `Prose` block spans the panel instead of shrinking to its longest line, which the Reasoning spec measured. The panel's content is any node; `keepMounted` passes through from Base UI and is what a nested collapsible needs to remember its open state while the parent is closed.

**Rows that are links, dialogs or sheets.** Not parts. A `TraceLine` inside an `a` is a link; inside a `DialogTrigger` or `DrawerTrigger` with `render={<TraceLine />}` it opens an overlay. The hover rule covers all of them by selecting the hovered ancestor, so a row never needs to know what it is inside.

### CSS

`trace.module.css` holds, in one layer with the package:

- `.line`: `color: var(--shade-muted)`, `min-width: 0`, `max-width: 100%`, and a color transition on the global duration and easing.
- Hover: `:where(a, button, [role="button"]):hover :where(.line), :where(.line):is(a, button, [role="button"]):hover` to `--shade-foreground`. Both forms, because the line is the trigger in a collapsible and a child in a link.
- `:where(.line)[data-status="error"]`: `color: var(--palette-text)`, hovered too.
- `:where(.line)[data-status="pending"]`: `opacity: 0.6`.
- `.icon`: the inline-flex box and the `svg` size. `.chevron`: a transform transition, and `:where([data-panel-open]) .chevron` rotated 90 degrees.
- `.trigger`: `cursor: pointer`, and the `:focus-visible` outline from `--globals-outline-*` with `--globals-border-radius`.
- `.description`: the shrink, the numerals and the opacity.
- `.panel`: the rule and its margin.

Every attribute selector is wrapped in `:where(.local)`, for the docs app's pure CSS modules. Nothing is copied from `shimmer.module.css`; the shimmer is the `Shimmer` component. No new tokens.

### Package

`packages/interactive/package.json` moves `@uiid/typography` from `devDependencies` to `dependencies`. `@uiid/typography` depends only on `@uiid/tokens` and `@uiid/utils`, so there is no cycle. `@uiid/icons` and `@uiid/layout` are dependencies already. The `@uiid/interactive` entry in `.size-limit.json` stays at `60 kB`; the barrel measured `44.97 kB` on 2026-11-01 and the Reasoning spec measured the Collapsible parts, `Badge` and `Shimmer` together at `+2.4 kB`, so the eight parts should land near `48 kB`.

## Files

```
packages/interactive/
  package.json                                    (@uiid/typography to dependencies)
  src/index.ts                                    (trace exports)
  src/trace/
    trace.tsx                                     (Trace root)
    trace.types.ts
    trace.context.ts                              (TraceLineContext: the status)
    trace.module.css
    trace.test.tsx
    trace.examples.tsx
    README.md
    subcomponents/
      index.ts
      trace-line.tsx
      trace-icon.tsx
      trace-title.tsx
      trace-description.tsx
      trace-collapsible.tsx
      trace-collapsible-trigger.tsx
      trace-collapsible-panel.tsx
apps/storybook/stories/interactive/
  trace.stories.tsx
  trace.mdx
docs/architecture/ai/capability-map.md            (spec table row)
```

`trace-line.tsx`, `trace-title.tsx` and the three collapsible files carry `"use client"`: the line provides a context, the title reads it, and the collapsible parts already are. `trace.tsx`, `trace-icon.tsx` and `trace-description.tsx` have no state and render on the server.

## Commands

```
pnpm run build --filter='./packages/*'
pnpm test:run packages/interactive
pnpm run build --filter=@uiid/interactive
pnpm run lint && pnpm run format:check
pnpm size
pnpm --filter @uiid/storybook dev
```

The first build is needed once in a fresh worktree so Storybook and the tests can resolve token CSS and sibling dist.

## Testing strategy

Vitest with happy-dom. `collapsible.test.tsx` is the template for the trigger's role and the open state, `message.test.tsx` for structure through `data-slot` and style props through `data-ui-*`.

- `Trace` is `data-slot="trace"` with `data-ui-gap="2"`, `data-ui-ax="start"` and `data-ui-fullwidth`; a caller's `gap`, `className` and `ref` reach it.
- `TraceLine` is a `span` with `data-slot="trace-line"`, `data-ui-gap="2"` and `data-ui-ay="center"`; `render={<div />}` changes the element; `status="error"` writes `data-status="error"` and the `palette-red` class; no status writes no attribute.
- `TraceIcon` has `aria-hidden="true"` and contains its child `svg`.
- `TraceTitle` writes `data-ui-truncate`; `truncate={false}` does not. In a `running` line a string title is `[data-slot="shimmer"]`; in a done line it is `[data-slot="text"]`; in a running line an element title is `[data-slot="text"]`. Outside any line it renders as `Text`.
- `TraceDescription` writes `data-ui-nowrap` and `data-slot="trace-description"`.
- `TraceCollapsibleTrigger` is `role="button"` with `aria-expanded="false"`, its `data-slot` is `trace-collapsible-trigger` and its `data-status` is the `status` it was given. A click, Enter and Space each toggle `aria-expanded` and the panel's presence. `defaultOpen` starts it open. Controlled `open` with `onOpenChange` reports the toggle and does not change on its own.
- Nesting: an outer collapsible whose panel has `keepMounted` holds an inner one. Open both, close the outer, reopen it: the inner is still `aria-expanded="true"`. Without `keepMounted` the inner panel is unmounted while the outer is closed.
- Barrel: the runtime export list of `@uiid/interactive` gains the eight parts.
- Examples: every export of `trace.examples.tsx` renders without throwing.

**Checked by hand in Storybook**, since happy-dom does no layout: the muted row lifting to the foreground on hover in both themes, the red error row, the dimmed pending row, the shimmer on a running title and its stillness under reduced motion, a long title truncating with its description still visible, the chevron turning, the panel's rule aligned under the icon's center at the global icon size, and a three-level nest with `keepMounted` keeping its state.

## Boundaries

- **Always:** `CollapsibleRoot`, `CollapsibleTrigger` and `CollapsiblePanel` from this package; `Text` and `Shimmer` for the title; `Group` and `Stack` for the boxes; `data-slot` on every part; `data-status` on the line and the trigger; the status vocabulary `running`, `error`, `pending`, unset; `:where(.local)` around every attribute selector; icons from their `@uiid/icons` subpaths; spacing through style props, arithmetic in the module.
- **Ask first:** any new token; a connector rail between rows; a `status` on the `Trace` root that cascades to its rows; a `TraceLine` that is a `Button`; a `TraceLink` or `TraceAction` part; raising the `60 kB` limit; any change to `Collapsible`, `Shimmer` or `Text`; placing the module in `@uiid/ai` or `@uiid/indicators` instead.
- **Never:** a second value in the context; copying `Shimmer`'s CSS into this module; `TraceCollapsibleContent` as a name; `cva` for the three statuses; `@uiid/code`; re-expressing `Reasoning` or `Tool` in this PR; inline styles; a spread of an SDK part onto any element.

## Success criteria

- Every acceptance criterion above holds.
- `pnpm test:run packages/interactive` passes, with the collapsible, resizable and sortable tests unchanged.
- `pnpm run build --filter=@uiid/interactive`, `pnpm run lint`, `pnpm run format:check` and `pnpm size` pass, the last at `60 kB`.
- Storybook has `Interactive/Trace` stories covering a plain row, the three statuses beside a done row, a description, a collapsible row, a link row, a summary opening into steps that open into output with `keepMounted`, and a whole agent turn of reasoning, tool and source rows with text between them, each backed by its README. The stories import nothing from `@uiid/ai`.
- The spec table in `capability-map.md` lists this spec.

## Follow-ups, not in this module

- `Reasoning` re-expressed as a `TraceCollapsible`, which deletes `packages/ai/src/shared/collapsible-trigger.module.css`. Its own PR, since it changes `@uiid/ai`'s rendered output and tests.
- `Sources`, `Task`, `Plan`, `ChainOfThought`, `Subagent` and `Queue` in `@uiid/ai`, one module each, every one a few rows of `Trace` around an AI SDK part.
- `Terminal`, `TestResults` and `StackTrace`, once a code block for `@uiid/ai` is decided; the Reasoning spec's decision 10 keeps `@uiid/code` out of the barrel.

## Resolved decisions

1. **`@uiid/interactive`, not `@uiid/ai` or `@uiid/indicators`.** It has no AI-specific knowledge, it is built on `Collapsible` which lives here, and `@uiid/ai` is private while this needs to reach the umbrella. `@uiid/indicators` holds `Timeline`, which is the card-and-rail register; two rail components in one package would invite merging them, and they are different things.
2. **shadcn's part names, with `Panel` for `Content`.** The wave 2 patterns are documented against these names, and the one rename follows Base UI and this package's `Collapsible`.
3. **The status lives on the line and reaches the title by one context value.** The title has to pick `Shimmer` or `Text`, which a selector cannot do for a component with a sized band. The context carries the status and nothing else.
4. **The line is a `span`.** It sits inside buttons and anchors, where only phrasing content is valid.
5. **The trigger is the line.** One element with the button role, the same proven pattern as `Reasoning` and `Tool`, and no interactive content nested inside interactive content.
6. **Error is the red palette class.** `Text` paints a `color` through `paletteColorStyles` and `--palette-text`; the line does the same, so an error row and a `<Text color="red">` are the same red.
7. **No connector between rows.** Upstream draws none; the only rule is the panel's indent under its icon. `Timeline` owns the marker rail.
8. **`Reasoning` and `Tool` stay as they are in this PR.** The primitive ships alone and is proven by its own stories and tests before anything in `@uiid/ai` moves onto it.

## Open questions

1. **What becomes of `Tool`?** shadcn's relaunched Tool is a `Trace` row: the tool's name with a status icon, opening into its input and output. UIID's `Tool` is a bordered card with a colored `Badge` over seven states. The card reads better alone; the row reads better in a list of ten steps. Keep the card and let the Subagent and Chain of Thought modules render tool parts as rows themselves, or re-express `Tool` on `Trace` and lose the badge? Decide when the `Tool` follow-up starts, not here.
