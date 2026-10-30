# Spec: `ai-reasoning-tool`

**Module:** `ai-reasoning-tool` (see [capability map](./capability-map.md))
**Package:** `@uiid/ai`
**Status:** Approved
**Upstream:** `ai-elements/packages/elements/src/reasoning.tsx` and `tool.tsx` at `ca8be60`
**Depends on:** `ai-scaffold`, `markdown`, `typography-shimmer`

## Objective

`Reasoning` is the collapsible "Thinking…" block above a model's reply. While the reasoning streams, its label shimmers and the panel is open so the reader can watch; when it finishes, the label says how long it took, the panel closes on its own a moment later, and the text stays available as rendered markdown behind the trigger. `Tool` is the collapsible card for one tool call: a header naming the tool with a colored state badge, and a panel showing the call's input and its output or error.

Both are trimmed ports. Upstream's `reasoning.tsx` is three parts and a context: `Reasoning` holds the open state, the streaming flag and the measured duration, `ReasoningTrigger` reads them to pick a label, and `ReasoningContent` is `streamdown` with four plugins. Here that is one component. The trigger has exactly one job, showing the state the root already holds, and the content is `Markdown`, which `SPEC-markdown.md` settled; a context to carry three values between parts that nobody composes differently is more mechanism than the component. Upstream's `tool.tsx` is five parts, `Tool`, `ToolHeader`, `ToolContent`, `ToolInput` and `ToolOutput`, that are always stacked in the same order from the same object. Here that is one `Tool` that takes the part and renders the stack, with `children` to replace the body when a product draws its own result. Each part can return as a named export later without a breaking change, the same way `MessageAction` can.

Collapsing is `@uiid/interactive`'s `CollapsibleRoot`, `CollapsibleTrigger` and `CollapsiblePanel`, which are Base UI's Collapsible on `Stack`, so both components take Base UI's `open`, `defaultOpen`, `onOpenChange` and `disabled` and `Stack`'s layout props on the root, unchanged. The composed parts rather than the `Collapsible` monolith because the trigger is a row of three things and the panel is `Markdown`, and the monolith's `trigger` prop would wrap that row in a second element.

**Acceptance criteria:**

- `<Reasoning streaming>` renders a trigger whose label is a `Shimmer` reading "Thinking…", and its panel is open, with the children rendered as markdown through `Markdown` with `streaming` forwarded. Mounting with `streaming` already true opens it; a later change from `false` to `true` opens it too.
- When `streaming` turns `false`, the label becomes "Thought for N seconds", N measured from when streaming started, and the panel closes one second later, once. A `duration` prop replaces the measurement. A `Reasoning` that mounts finished, with no `duration`, reads "Reasoning" and is closed.
- `defaultOpen={false}` stops the auto-open. A controlled `open` is never overridden: the auto transitions call `onOpenChange` and leave `open` to the caller.
- `<Tool part={part}>` renders a header with the tool's name and a badge for every one of the seven `ToolState` values, each with its own label, icon and hue from the table below. `output-error` is red and `output-denied` is orange; `output-available` is green. The name is `part.title`, else `part.toolName`, else `part.type` with its `tool-` prefix removed.
- The panel shows a "Parameters" section with `part.input` as pretty-printed JSON when input exists, and a "Result" section with `part.output` when output exists: a string as code, an object as pretty-printed JSON, a React element as itself. `part.errorText` turns the section's heading to "Error" and renders the text in red above any output. With neither output nor error, there is no second section. `children` replaces the whole body.
- `Tool` is closed by default and opens from its trigger. Every Base UI Collapsible prop and `Stack` layout prop passes to the root.
- Every element writes a `data-slot`: `reasoning`, `reasoning-trigger`, `reasoning-panel`, `tool`, `tool-trigger`, `tool-status`, `tool-panel`, `tool-input`, `tool-output`. `Reasoning` writes `data-streaming` while streaming and `Tool` writes `data-state` with the part's state, so a consumer can style either by state.
- `ToolPart` is defined in this module and the AI SDK's `ToolUIPart` and `DynamicToolUIPart` both satisfy it, pinned by a type test. `ToolState` is imported from `ai.types.ts`. No `ai` SDK import outside the test.
- `packages/ai/package.json` adds `@uiid/interactive` and `@uiid/indicators`. `pnpm size` passes for `@uiid/ai` at its existing `80 kB` limit.

## API

```ts
// reasoning.types.ts
import type { CollapsibleRootProps } from "@uiid/interactive";

export type ReasoningProps = Omit<CollapsibleRootProps, "children"> & {
  /** The reasoning, as markdown. It may be cut off anywhere while it streams. */
  children: string;
  /**
   * The reasoning is still arriving. Shimmers the label, opens the panel,
   * and holds back unfinished markdown syntax until it is complete.
   */
  streaming?: boolean;
  /** Seconds spent thinking, for the finished label. Measured from `streaming` when omitted. */
  duration?: number;
};

// tool.types.ts
import type { CollapsibleRootProps } from "@uiid/interactive";

import type { ToolState } from "../ai.types";

/**
 * The fields of an AI SDK tool part that Tool renders. Structurally satisfied
 * by both `ToolUIPart` and `DynamicToolUIPart`, so a part from `useChat` is
 * passed as it is.
 */
export type ToolPart = {
  /** `tool-<name>` for a static tool, `dynamic-tool` for a dynamic one. */
  type: string;
  /** The tool's name, on a dynamic part. A static part carries it in `type`. */
  toolName?: string;
  /** A display name, when the part carries one. */
  title?: string;
  state: ToolState;
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

export type ToolProps = Omit<CollapsibleRootProps, "part"> & {
  /** The tool call to show. */
  part: ToolPart;
};
```

`CollapsibleRootProps` is `WithLayoutProps<Collapsible.Root.Props, StackProps>`, so both roots take `open`, `defaultOpen`, `onOpenChange`, `disabled`, `className`, `render`, `ref` and the `Stack` layout props. `ReasoningProps` omits `children` only to narrow it to a string, as `MarkdownProps` and `ShimmerProps` do. `ToolProps` keeps `children` as a node: when given, it replaces the default input and output body. It omits the root's own `part` because HTML's `part` attribute already types it as a string, and the SDK's object has to win.

The prop is `streaming`, not upstream's `isStreaming`. `Markdown` and `MessageResponse` already call it `streaming`, and one name across the package beats parity with upstream's.

Usage, which is upstream's shape with the parts collapsed:

```tsx
<Message from="assistant">
  <MessageContent>
    {message.parts.map((part, index) => {
      switch (part.type) {
        case "reasoning":
          return (
            <Reasoning key={index} streaming={part.state === "streaming"}>
              {part.text}
            </Reasoning>
          );
        case "text":
          return (
            <MessageResponse key={index} streaming={status === "streaming"}>
              {part.text}
            </MessageResponse>
          );
        default:
          if (part.type === "dynamic-tool" || part.type.startsWith("tool-")) {
            return <Tool key={index} part={part} />;
          }
          return null;
      }
    })}
  </MessageContent>
</Message>
```

A product that draws its own result keeps the header and the badge and supplies the body:

```tsx
<Tool part={part}>
  <WeatherCard {...part.output} />
</Tool>
```

Exports from the barrel: `Reasoning`, `Tool`, and the types `ReasoningProps`, `ToolPart` and `ToolProps`.

## Implementation notes

### Reasoning structure

```
[data-slot=reasoning][data-streaming]       CollapsibleRoot, Stack, gap 2, ax start
  [data-slot=reasoning-trigger]             CollapsibleTrigger, render Group gap 2 ay center, role button
    BrainIcon
    [data-slot=shimmer] "Thinking…"         Shimmer while streaming
    [data-slot=text] "Thought for 4 seconds" Text otherwise
    ChevronDownIcon                         rotated while open
  [data-slot=reasoning-panel]               CollapsiblePanel, Stack, ax stretch, animated
    [data-slot=markdown]                    Markdown, streaming forwarded
```

The file carries `"use client"`: it holds the open state and runs effects.

**Open state.** The auto transitions have to set the panel's state, so `Reasoning` owns it and passes `open` and `onOpenChange` to the root. The state is `useState(defaultOpen ?? streaming)`; when the caller passes `open`, that wins and the local value is ignored. One `setOpen` helper calls `onOpenChange` and updates the local value only when uncontrolled. There is no controllable-state hook in `@uiid/utils` or Base UI's public surface, and these are three lines.

**Auto-open.** An effect: when `streaming` is true, the panel is closed and `defaultOpen` was not `false`, call `setOpen(true)`. `defaultOpen === false` is the caller saying they do not want the panel to open on its own, which is upstream's `isExplicitlyClosed`.

**Duration and auto-close.** One effect on `streaming`. When it turns true, a ref records `Date.now()`. When it turns false and the ref is set, the elapsed seconds are stored in state, rounded up, and a one-second timer calls `setOpen(false)`; the effect's cleanup clears the timer, and a ref remembers that the close has happened so it runs once. A `duration` prop takes precedence over the measured value. A `Reasoning` that never streamed never auto-closes, so a transcript that mounts with `defaultOpen` stays open.

**Label.** Streaming, or a measured duration of zero, renders `<Shimmer>Thinking…</Shimmer>`. Otherwise `<Text>` with "Thought for N seconds", "1 second" when N is one, or "Reasoning" when there is no duration from either source. Upstream says "Thought for a few seconds" in that last case; this spec does not, because a transcript reloaded from storage would then claim a duration nobody measured. Both labels sit in `reasoning.constants.ts`.

**Trigger.** `CollapsibleTrigger` with `nativeButton={false}` and `render={<Group gap={2} ay="center" />}`, so Base UI gives the `Group` `role="button"`, `tabIndex`, `aria-expanded` and Enter and Space, the way the Collapsible README prescribes for a non-button element. It is not a `Button`: upstream's trigger is a muted text row that turns to the foreground color on hover, with no surface or padding, and a `Button` would bring both and then have them turned off. The children are `BrainIcon` from `@uiid/icons/brain`, the label, and `ChevronDownIcon` from `@uiid/icons/chevron-down`. The label `Text` takes `color="neutral"`, the package's register for muted text; `Shimmer` takes the same so the band washes in the neutral tint.

**Panel.** `CollapsiblePanel` with `instant={false}` and `ax="stretch"`, holding `<Markdown streaming={streaming}>{children}</Markdown>`. Base UI sets `--collapsible-panel-height` to `auto` once the panel is open and idle, so markdown growing while it streams is not clipped by the height transition; the transition runs only on open and close. `ax="stretch"` so the `Prose` spans the panel instead of shrinking to its longest line.

### Tool structure

```
[data-slot=tool][data-state=output-available]   CollapsibleRoot, Stack, fullwidth, b 1, radius
  [data-slot=tool-trigger]                      CollapsibleTrigger, render Group fullwidth space-between ay center p 3, role button
    Group gap 2 ay center
      WrenchIcon
      [data-slot=text] "search"                 Text, weight medium
      [data-slot=tool-status]                   Badge, small, color from the state
        CircleCheckIcon "Completed"
    ChevronDownIcon                             rotated while open
  [data-slot=tool-panel]                        CollapsiblePanel, Stack, ax stretch, gap 4, p 4, animated
    [data-slot=tool-input]                      Stack gap 2: "Parameters" heading, code
    [data-slot=tool-output]                     Stack gap 2: "Result" or "Error" heading, error text, code or element
```

`Tool` holds no state and runs no effect; the collapsible parts are client components already, so the file needs no `"use client"`.

**Root.** `CollapsibleRoot` with `fullwidth` and `b={1}` as defaults and `data-state={part.state}`. The module adds `border-radius: var(--globals-border-radius)` and `overflow: hidden`, so the trigger's hover surface clips to the corners. Not `Card`: a card's title, description, action and footer slots do not map onto a trigger, and the one thing wanted from it, a bordered rounded surface, is a style prop and one rule.

**Header.** The trigger is `CollapsibleTrigger` with `nativeButton={false}` and `render={<Group fullwidth ax="space-between" ay="center" gap={2} p={3} />}`, the same pattern as `Reasoning`'s. The left `Group` holds `WrenchIcon` from `@uiid/icons/wrench`, the name in a `Text` with `weight="medium"`, and the badge. The chevron sits at the end.

**State badge.** `Badge` from `@uiid/indicators` with `size="small"`, `color` from the table, and the state's icon followed by its label as children. `Badge` wraps children in its own `Text`, so the icon rides inline with the label; the module sizes an `svg` inside `[data-slot=tool-status]` to `1em` and nudges it onto the baseline. The `input-available` icon spins, one keyframe in the module, switched off under `prefers-reduced-motion`. The table lives in `tool.constants.ts` as one `Record<ToolState, { label, icon, color }>`:

| `ToolState`          | Label             | Icon                         | Badge `color` |
| -------------------- | ----------------- | ---------------------------- | ------------- |
| `input-streaming`    | Pending           | `CircleDashedIcon`           | `neutral`     |
| `input-available`    | Running           | `LoaderCircleIcon`, spinning | `blue`        |
| `approval-requested` | Awaiting approval | `ClockIcon`                  | `yellow`      |
| `approval-responded` | Responded         | `CircleCheckIcon`            | `indigo`      |
| `output-available`   | Completed         | `CircleCheckIcon`            | `green`       |
| `output-error`       | Error             | `CircleXIcon`                | `red`         |
| `output-denied`      | Denied            | `BanIcon`                    | `orange`      |

Seven states, seven hues, so no two states share a color. Each icon is imported from its `@uiid/icons` subpath.

**Body.** `CollapsiblePanel` with `instant={false}`, `ax="stretch"`, `gap={4}` and `p={4}`. When `children` is given it is the body. Otherwise two local pieces, `ToolInput` and `ToolOutput` in `subcomponents/`, not exported: each is a `Stack` with `gap={2}`, a heading `Text` with `size={-1}`, `color="neutral"`, `uppercase` and `weight="medium"`, and the content. `ToolInput` renders when `part.input !== undefined` and pretty-prints it with `JSON.stringify(input, null, 2)`. `ToolOutput` renders when `part.output !== undefined` or `part.errorText` is set; its heading is "Error" when there is error text, which renders as a `Text` with `color="red"` above any output. A string output renders as code, a React element as itself, and anything else as pretty-printed JSON.

**Code.** The JSON and string code render through a local `ToolCode` piece: `Prose` from `@uiid/typography` around `<pre><code>{text}</code></pre>`. `Prose` already styles a `pre` with the surface fill, the mono face and horizontal scroll, which is what `Markdown` produces for a fence, so the tool body matches a fenced block in the reply above it. It adds nothing to the bundle. Not `CodeBlock` from `@uiid/code`: resolved decision 10. A product that wants highlighting passes `children` with its own `CodeBlock`.

### CSS

`reasoning.module.css` holds three rules: `.trigger` with `cursor: pointer` and the neutral color, `.trigger:hover` to the foreground color, and `:where(.trigger)[data-panel-open] .chevron` rotated 180 degrees with the global transition, plus an `svg` size of `var(--globals-icon-size)` inside the trigger. Base UI writes `data-panel-open` on the trigger while the panel is open, so the rotation needs no state.

`tool.module.css` holds the root's radius and overflow, the trigger's cursor and hover surface (`--shade-surface`), the same chevron rule, the badge's inline `svg` size, and the spin keyframe with its reduced-motion override. No variants file: the state is written as `data-state` on the root and as the badge's `color`, so there is nothing for `cva` to switch. No new tokens.

The design-system `globals.css` import stays deferred with scaffold rows 10 and 11.

### Package

`packages/ai/package.json` adds `@uiid/interactive` and `@uiid/indicators` as `workspace:*` dependencies. The `@uiid/ai` entry in `.size-limit.json` stays at `80 kB`.

Measured on 2026-10-29 against the dist of `92d0f18b` by bundling the barrel with each addition through esbuild and brotli, the way `pnpm size` does. The barrel alone is `74.69 kB` under `pnpm size`.

| Addition                                | Cost        | `@uiid/ai` would be |
| --------------------------------------- | ----------- | ------------------- |
| `Collapsible` parts, `Badge`, `Shimmer` | `+2.4 kB`   | about `77 kB`       |
| `CodeBlock` from `@uiid/code`           | `+110.6 kB` | about `185 kB`      |

The `+110 kB` is shiki's core and its JavaScript regex engine, which `CodeBlock` imports at module scope; languages and themes are lazy and would not count. It lands in every consumer of the `@uiid/ai` barrel, not only those that render a `Tool`, because `pnpm size` measures the barrel, and a consumer whose bundler does not tree-shake it pays the same.

## Files

```
packages/ai/
  package.json                                      (@uiid/interactive, @uiid/indicators)
  src/index.ts                                      (Reasoning, Tool exports)
  src/index.test.ts                                 (the barrel's runtime export list)
  src/ai.types.test.ts                              (ToolPart satisfied by both SDK parts)
  src/reasoning/
    reasoning.tsx
    reasoning.types.ts
    reasoning.constants.ts
    reasoning.module.css
    reasoning.test.tsx
    reasoning.examples.tsx
    README.md
  src/tool/
    tool.tsx
    tool.types.ts
    tool.constants.ts
    tool.module.css
    tool.test.tsx
    tool.examples.tsx
    README.md
    subcomponents/
      index.ts
      tool-input.tsx
      tool-output.tsx
      tool-code.tsx
      tool-heading.tsx
apps/storybook/stories/ai/
  reasoning.stories.tsx
  reasoning.mdx
  tool.stories.tsx
  tool.mdx
docs/architecture/ai/capability-map.md              (spec table row)
```

## Commands

```
pnpm run build --filter='./packages/*'
pnpm test:run packages/ai
pnpm run build --filter=@uiid/ai
pnpm run lint && pnpm run format:check
pnpm size
pnpm --filter @uiid/storybook dev
```

The first build is needed once in a fresh worktree so Storybook and the tests can resolve token CSS and sibling dist.

## Testing strategy

Vitest with happy-dom. `collapsible.test.tsx` is the template for the open state and the trigger's role, `message.test.tsx` for structure through `data-slot`, style props through `data-ui-*` and an examples render test. Timers and `Date.now` through `vi.useFakeTimers`.

**Reasoning:**

- The root is `data-slot="reasoning"` with `data-ui-gap="2"`; `streaming` writes `data-streaming`. A caller's `gap`, `className` and `ref` reach the root.
- The trigger has `role="button"` and `aria-expanded`. While `streaming` its accessible name is "Thinking…" and the label is `[data-slot="shimmer"]`. With `duration={4}` and no streaming it is "Thought for 4 seconds"; `duration={1}` is "Thought for 1 second"; neither is "Reasoning".
- Mounted with `streaming`, the panel is open and the children are rendered as elements: `**bold**` is a `strong`. An unclosed trailing `**word` is plain text while streaming and shows the delimiters once it is not, which pins the forward of `streaming`.
- Mounted without `streaming` and without `defaultOpen`, the panel is closed; clicking the trigger opens it.
- Re-rendering from `streaming={false}` to `true` opens a closed panel. With `defaultOpen={false}` it stays closed.
- With fake timers: `streaming` on, advance four seconds, `streaming` off. The label reads "Thought for 4 seconds" at once, the panel is still open, and after one more second it is closed. Turning `streaming` on and off again does not close it a second time.
- Controlled: `open={true}` with `onOpenChange`; when streaming ends the callback receives `false` after the delay and the panel stays open because the prop still says so.

**Tool:**

- The root is `data-slot="tool"` with `data-state` equal to the part's state, `data-ui-fullwidth` and `data-ui-b="1"`. A caller's `b`, `className` and `ref` reach it.
- The name: `type: "tool-search"` reads "search"; `type: "dynamic-tool", toolName: "lookup"` reads "lookup"; a `title` wins over both.
- `it.each` over the seven states: the badge is `[data-slot="tool-status"]`, contains the state's label, and carries that hue's palette class from `paletteColorStyles`.
- Closed by default; clicking the trigger opens it. Open, with `input: { q: "weather" }`, the input section's heading reads "Parameters" and its `pre` contains `"q": "weather"` on its own line, which pins the pretty-print.
- Output: a string renders inside a `pre`; an object renders pretty-printed; an element renders as itself, found by a test id. The heading reads "Result".
- `errorText` renders a heading "Error" and the text; with no output the section still renders. With neither output nor error text there is no `[data-slot="tool-output"]`.
- `children` replaces the body: the input section is absent and the child is present.

**Types:** `ai.types.test.ts` asserts `ToolUIPart` and `DynamicToolUIPart` from `ai` each extend `ToolPart`. `tsc` fails when the SDK adds a required field the local type lacks or changes a shared one.

**Barrel:** the runtime export list gains `Reasoning` and `Tool`.

**Examples:** every export of `reasoning.examples.tsx` and `tool.examples.tsx` renders without throwing; the states example renders all seven labels.

**Checked by hand in Storybook**, since happy-dom does no layout: the shimmer sweeps across "Thinking…" in both themes and stops under reduced motion; the panel opens and closes with the height transition and does not clip while text streams into it; the chevron turns; the tool card's border, radius and hover surface; the seven badges read distinctly in both themes; a wide JSON input scrolls inside the card; the running icon spins.

## Boundaries

- **Always:** `CollapsibleRoot`, `CollapsibleTrigger` and `CollapsiblePanel` from `@uiid/interactive`; `Shimmer` for the pending label; `Markdown` for the reasoning text; `Badge` for the state; `ToolState` from `ai.types.ts`; `data-slot` on every element; `data-streaming` and `data-state` on the roots; icons from their `@uiid/icons` subpaths; `:where(.local)` around any attribute selector in a module.
- **Ask first:** raising the `@uiid/ai` size limit above `80 kB`; a `ReasoningTrigger`, `ReasoningContent`, `ToolHeader`, `ToolInput` or `ToolOutput` as an exported part; a `label` or `getThinkingMessage` override; an approval-response button row inside `Tool`; a context between the parts; any new token; any change to `Collapsible`, `Badge`, `Shimmer` or `Markdown`.
- **Never:** `@uiid/code` in the default body; `streamdown` or any markdown plugin; a `ReasoningContext` or `useReasoning`; `isStreaming` as the prop name; `Card` for the tool surface; `Button` as the trigger; a spread of the SDK part onto the root; inline styles; an `ai` SDK import outside the type test.

## Success criteria

- Every acceptance criterion above holds.
- `pnpm test:run packages/ai` passes, with the markdown, conversation, message and prompt-input tests unchanged.
- `pnpm run build --filter=@uiid/ai`, `pnpm run lint`, `pnpm run format:check` and `pnpm size` pass, the last at `80 kB`.
- Storybook has `AI/Reasoning` stories covering a finished block, a streaming block that opens, finishes and closes, and a block above a `MessageResponse` inside `MessageContent`, and `AI/Tool` stories covering a completed call, all seven states, a call cycling through its lifecycle, and a message with reasoning, a tool and a response in order, each backed by its README.
- The spec table in `capability-map.md` lists this spec.

## Follow-ups, not in this module

- An approve and deny row for `approval-requested`, once a product needs one; it is a `Group` of two `Button`s under the input section and a callback prop.
- `ToolInput` and `ToolOutput` as exported parts, if products that pass `children` keep rebuilding one of them.
- A `label` override on `Reasoning` for localization or a product voice.
- `Sources`, `InlineCitation` and the rest of upstream's text parts; each is its own capability-map entry.
- Publishing `@uiid/ai`, the POC's final step, its own PR.

## Resolved decisions

1. **One `Reasoning`, one `Tool`.** Upstream's parts always render in the same order from the same values, and the only thing the context carried was the root's own state. The trigger and panel are composed inside; the exported parts can come back additively.
2. **`streaming`, not `isStreaming`.** The package already uses `streaming` on `Markdown` and `MessageResponse`.
3. **Duration is measured locally and overridable.** The AI SDK's reasoning part carries no timing, and the shimmer turning into "Thought for 4 seconds" is the affordance upstream users know. One ref and one effect; `duration` wins when passed. A block with no duration from either source reads "Reasoning", not "Thought for a few seconds".
4. **The panel auto-closes once, a second after streaming ends.** Without it every reasoning block in a live transcript stays open above its reply. A block that never streamed never auto-closes.
5. **The triggers are a `Group` with `nativeButton={false}`, not a `Button`.** Upstream's triggers are bare rows; Base UI supplies the button semantics the README documents for a non-button element.
6. **`Tool` takes `part`, not a spread.** An SDK part carries `toolCallId`, `approval`, `callProviderMetadata` and more, which spread onto a `div` would reach the DOM. One prop takes the object `useChat` hands over as it is.
7. **`ToolPart` lives in `tool.types.ts`.** Locked by the ticket: only `Tool` reads it, so it is not a shared type.
8. **Seven states, seven hues.** `approval-responded` takes `indigo` rather than upstream's second blue so no two badges share a color.
9. **Not `Card`.** The bordered rounded surface is `b={1}` and one radius rule, as the message bubble is a surface on a `Stack`.
10. **Tool code is `Prose` around a `pre`, and the `@uiid/ai` limit stays at `80 kB`.** Decided 2026-10-29. The ticket named `@uiid/code` and said to ask before raising the limit. Measured, `CodeBlock` adds about `110 kB` to the barrel because shiki's core and regex engine load at module scope, and the entry would have moved from `80 kB` to `190 kB` for every consumer whether or not they render a `Tool`. `Prose` around a `pre` adds nothing, matches how a fence in the reply already renders, and a product that wants highlighting passes `children` with its own `CodeBlock`.

## Open questions

None.
