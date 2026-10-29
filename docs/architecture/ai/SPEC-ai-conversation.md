# Spec: `ai-conversation`

**Module:** `ai-conversation` (see [capability map](./capability-map.md))
**Package:** `@uiid/ai`
**Status:** Approved
**Upstream:** `ai-elements/packages/elements/src/conversation.tsx` at `ca8be60`, which wraps `use-stick-to-bottom`'s `StickToBottom` component and context
**Depends on:** `ai-scaffold`

## Objective

`Conversation` is the scroll region of a chat. While a response streams in, it stays pinned to the newest content. When the reader scrolls up to re-read something, it lets go and leaves them where they are. `ConversationScrollButton` then appears, and one press scrolls back down and re-pins. `ConversationEmptyState` fills the region before the first message.

The pinning is a local hook, `useStickToBottom`, written for this package. The capability map rules out the `use-stick-to-bottom` dependency, and most of what that library does is not needed here: its spring-physics scroll animation, its velocity bookkeeping to tell a user's wheel from its own animation, its text-selection guard, and its `targetScrollTop` indirection. What remains is one scroll listener, one `ResizeObserver`, and one rule for when to release the pin. `ConversationDownload` is out of scope.

This is the first module to ship CSS from `@uiid/ai`, so it also adds the package's `./globals.css` export.

**Acceptance criteria:**

- A transcript rendered inside `Conversation` opens scrolled to its newest message, with no visible frame at the top first.
- While pinned, content appended to `ConversationContent` keeps the newest content in view. The scroll container itself shrinking (a prompt input growing below it, a window resize) also keeps the newest content in view.
- Scrolling up past the release threshold unpins. Content that arrives afterwards does not move the reader. `ConversationScrollButton` renders only while unpinned.
- Pressing the button scrolls to the bottom and re-pins. So does scrolling back to within the threshold by hand.
- A smooth scroll to the bottom in progress does not unpin itself, and content that shrinks while pinned does not unpin either.
- Scrolling honors `prefers-reduced-motion`: the button's scroll is smooth by default and instant under reduced motion. Resize follow is always instant.
- `Conversation` has `role="log"` and `data-slot="conversation"`. The parts write `data-slot="conversation-content"`, `data-slot="conversation-empty-state"` and `data-slot="conversation-scroll-button"`. The scroller `ConversationContent` owns writes `data-slot="conversation-viewport"`.
- `ConversationScrollButton` is a `Button`. `ConversationEmptyState` is a `Stack` of `Text`, filling and centered in the region. Every part passes its host component's props through, including `ref`, `className` and `render` where the host has one.
- `useConversation()` exposes `isAtBottom` and `scrollToBottom` to anything inside `Conversation`, and throws a named error outside it.
- `"use client"` sits on the component and hook files, not the barrel. The server render is the pinned state, so the button is absent from server HTML.
- No new runtime dependency outside the workspace. `pnpm size` passes against the entry raised to `80 kB` (see open question 4).

## API

```ts
import type { ButtonProps } from "@uiid/buttons";
import type { BoxProps, StackProps } from "@uiid/layout";

/** The scroll region. Size it from outside with `h`, `fullheight` or `grow`. */
export type ConversationProps = BoxProps;

/** The column of messages. Props go to the inner `Stack`; the scroller is internal. */
export type ConversationContentProps = StackProps;

export type ConversationEmptyStateProps = StackProps & {
  /** Heading. Defaults to "No messages yet". */
  title?: string;
  /** Supporting line under the heading. Defaults to "Start a conversation to see messages here". */
  description?: string;
  /** Icon rendered above the heading. */
  icon?: React.ReactNode;
};

/** A `Button` that appears while the reader is scrolled up. Defaults to a small, subtle circle with an arrow and the label "Scroll to bottom". */
export type ConversationScrollButtonProps = ButtonProps;

export type UseStickToBottomReturn = {
  /** Attach to the element that scrolls. */
  scrollRef: (node: HTMLElement | null) => void;
  /** Attach to the element whose size changes as content arrives. */
  contentRef: (node: HTMLElement | null) => void;
  /** Whether the container is pinned to its newest content. */
  isAtBottom: boolean;
  /** Re-pin and scroll to the newest content, following the container's `scroll-behavior`. */
  scrollToBottom: () => void;
};

export const useStickToBottom: () => UseStickToBottomReturn;

/** The `useStickToBottom` instance of the nearest `Conversation`. */
export const useConversation: () => UseStickToBottomReturn;
```

Usage, which is upstream's shape with the download button removed:

```tsx
<Conversation h={480}>
  <ConversationContent>
    {messages.length === 0 ? (
      <ConversationEmptyState icon={<MessageSquareIcon />} />
    ) : (
      messages.map((message) => <Message key={message.id} {...message} />)
    )}
  </ConversationContent>
  <ConversationScrollButton />
</Conversation>
```

`ConversationScrollButton` is a sibling of `ConversationContent`, not a child, so it is positioned against the region rather than scrolling away with the messages. `ConversationEmptyState` goes inside `ConversationContent`, where it centers in the region's full height.

## Implementation notes

### Structure

Three nested elements, which is what upstream renders once `StickToBottom` and `StickToBottom.Content` are unfolded:

```
[data-slot=conversation]            Box, role="log", position: relative, overflow: hidden
  [data-slot=conversation-viewport]   div, width and height 100%, overflow-y: auto, scroll-behavior: smooth   ← scrollRef
    [data-slot=conversation-content]  Stack, stretch, fullwidth, gap 8, p 4, min-height: 100%        ← contentRef
  [data-slot=conversation-scroll-button]  Button, position: absolute, bottom center
```

`Conversation` calls `useStickToBottom()` once, provides the result through `ConversationContext`, and renders a `Box` around its children. It does not size itself. Upstream's `flex-1` assumption is dropped: the consumer passes `h`, `fullheight` or `grow`, and the root's `min-height: 0` lets `grow` shrink inside a `Stack`.

`ConversationContent` renders the viewport `div` with `scrollRef` and, inside it, a `Stack` with `contentRef`. The viewport is internal and takes no props. The `Stack` takes all of them, with `ax = "stretch"`, `fullwidth`, `gap = 8` and `p = 4` destructured as defaults so a caller's values win (see the render merge-order note in `.agents/components.md`). The first two are needed because `Stack` is `inline-flex` with `align-items: flex-start`: without them the column shrinks to its content and nothing inside spans the region. Its `min-height: 100%` is what lets an empty state center vertically; a short transcript still starts at the top because the column justifies to start. The viewport sets `scrollbar-gutter: stable both-edges`, as upstream does, so the first overflow does not shift the column.

`ConversationEmptyState` is `Stack ax="center" ay="center" gap={3} p={8} grow` with `text-align: center` from the module. It is `grow`, not `fullheight`, because a percentage height against the content's `min-height` resolves to auto, while `flex: 1` fills the column. Its default children are the icon inside a `Text color="neutral"`, then a `Text weight="medium" render={<h3 />}` title and a `Text color="neutral"` description. `color="neutral"` is the secondary gray in both themes; `emphasis="muted"` is the on-fill color and is near invisible on the page background, which the headless check confirmed at rgb(236, 235, 233) on rgb(254, 254, 250). Passing `children` replaces all of that, as upstream does. Centered text comes from the module because `Text` has no alignment prop, and the chapter's rule is a module rule over an inline style.

`ConversationScrollButton` reads `isAtBottom` and `scrollToBottom` from context and returns `null` while pinned. Otherwise it renders `Button` with `shape="circle"`, `variant="subtle"`, `size="small"`, `type="button"`, `aria-label` from a constant, an `ArrowDownIcon` from `@uiid/icons/arrow-down` as default children, and the module's position class merged into `className`. Every prop passes through after the defaults, so a caller can change the icon, the label or the variant. The position is `left: 50%` with `translate: -50%`, which is symmetric and so correct in both writing directions, and `calc(var(--spacing-unit) * 4)` from the bottom.

`ConversationContext` and `useConversation` follow `packages/indicators/src/timeline/timeline.context.ts`: a `null` default and a hook that throws `` `useConversation` must be used within `Conversation` ``.

### The hook

`useStickToBottom` lives in `conversation/hooks/use-stick-to-bottom.ts`, next to the pattern in `packages/tables/src/table/hooks/use-scroll-affordance.ts`.

State is one boolean, pinned, held in a ref for the listeners and mirrored into React state for rendering. The setter writes both and skips the state update when nothing changed. The refs it returns are callback refs that store their node in state, so the effect below re-runs if `ConversationContent` mounts after `Conversation` does, or is swapped out and back.

The effect runs when both nodes are present. It is a `useLayoutEffect` so that the observer is attached before the first paint, which is what makes the initial jump invisible: a `ResizeObserver` delivers one notification on `observe()`, in the same frame, and that notification performs the first scroll to the bottom. React 19 does not warn about `useLayoutEffect` on the server.

The effect installs two things:

1. A `ResizeObserver` on both the viewport and the content. Its callback does one thing: if pinned, `viewport.scrollTo({ top: viewport.scrollHeight, behavior: "instant" })`. Observing the viewport as well as the content is what keeps the bottom in view when the region shrinks rather than the content growing.
2. A passive `scroll` listener. It computes `distance = scrollHeight - scrollTop - clientHeight` and applies one rule:
   - `distance <= CONVERSATION_SCROLL_THRESHOLD` (70 px, upstream's value): pin.
   - otherwise, if `scrollTop` is lower than the previous scroll event's: release.
   - otherwise: leave the state alone.

   It then records `scrollTop` for the next event.

That rule is the whole substitute for upstream's wheel listener, `ignoreScrollToTop` bookkeeping and selection guard. A reader scrolling up, by wheel, touch, keyboard or dragging the thumb, lowers `scrollTop` and lands outside the threshold, so they release. A smooth `scrollToBottom()` in progress raises `scrollTop` on every intermediate event, so it never releases itself. Content that shrinks while pinned makes the browser clamp `scrollTop`, which lowers it, but the clamp lands at distance zero, so the first branch pins before the second can release. Content shorter than the viewport is always at distance zero, so the button never shows for a transcript that fits.

`scrollToBottom()` pins, then calls `viewport.scrollTo({ top: viewport.scrollHeight })` with no `behavior`. The default behavior is `auto`, which defers to the element's CSS `scroll-behavior`. The module sets that to `smooth` and overrides it to `auto` under `prefers-reduced-motion: reduce`, so reduced motion is handled in one CSS rule and the hook never asks about it. Resize follow passes `behavior: "instant"` explicitly because a smooth animation on every streamed token would never settle.

Two consequences, both acceptable: if tokens arrive during the button's smooth scroll, the observer's instant jump cuts the animation short and lands at the bottom; and there is no spring, so following a resize is a jump rather than a glide. The second is the open question below.

The hook takes no options. The threshold is a constant in `conversation.constants.ts`; an options object can be added later without changing callers.

### CSS and the `globals.css` export

`conversation.module.css` holds four rules plus the reduced-motion override: the root's `position`, `overflow` and `min-height`, the viewport's `width` and `height` (it is a flex item of the root and would otherwise shrink to its content), `overflow-y`, `scroll-behavior` and `scrollbar-gutter`, the content's `min-height`, the empty state's `text-align`, and the button's position. Layout and spacing stay on `Stack` props. Nothing here varies, so there is no `.variants.ts`.

This is `@uiid/ai`'s first stylesheet, so `packages/ai/package.json` gains `"./globals.css": "./dist/ai.css"` in `exports`, matching `packages/interactive`. The file name is the one Vite derives from the package name, confirmed at build. `sideEffects: ["*.css"]` is already set.

Scaffold row 11, the `@import "@uiid/ai/globals.css"` in `packages/design-system/src/globals.css`, stays deferred alongside row 10. The design-system build inlines its imports, which means resolving `@uiid/ai` from its `node_modules`, which means a dependency on a private package, which is the thing row 10 forbids until the package is published. Nothing needs it yet: Storybook aliases `@uiid/ai` to source, so the component's own `import styles from "./conversation.module.css"` carries the CSS in, and the Storybook PostCSS config wraps anything under `packages/ai/` in `uiid.components`. `apps/docs` does not cover `@uiid/ai`.

### Dependencies

`packages/ai/package.json` adds `@uiid/buttons`, `@uiid/icons`, `@uiid/layout` and `@uiid/utils` as `workspace:*` dependencies. All `@uiid/*` imports are external in the package build, so none of them reach `dist`. `pnpm size` is a different measure: it bundles `dist/index.js` with everything it imports, workspace packages included, so `Button` brings its `Tooltip` and the Base UI and Floating UI code behind it. Measured after this module, `@uiid/ai` is 65.85 kB brotli, of which `@uiid/buttons` alone accounts for about 40 kB. The scaffold's `40 kB` entry was set for a types-only package and was already expected to move as modules landed; it is `80 kB` in `.size-limit.json`; see open question 4.

One wrinkle found at build time: the package's lockfile entries for `@types/react` and `@types/react-dom` had resolved to newer versions than every sibling package uses, because `@uiid/ai` was scaffolded later. The built `.d.ts` files of `@uiid/utils` and `@uiid/layout` resolve `react` from their own `node_modules`, so a ref type from one copy was unrelated to the same type from the other and `tsc` refused to compose them. The entries are pinned to the siblings' versions in `pnpm-lock.yaml`, with the declared `^` ranges unchanged.

## Files

```
packages/ai/src/conversation/
  conversation.tsx                       ("use client": Conversation, the context provider)
  conversation.context.ts                (ConversationContext, useConversation)
  conversation.types.ts
  conversation.constants.ts              (threshold, default title, description and button label)
  conversation.module.css
  conversation.test.tsx
  conversation.examples.tsx
  README.md
  hooks/use-stick-to-bottom.ts           ("use client")
  subcomponents/conversation-content.tsx
  subcomponents/conversation-empty-state.tsx
  subcomponents/conversation-scroll-button.tsx
  subcomponents/index.ts
packages/ai/src/index.ts                 (export the parts and both hooks)
packages/ai/src/index.test.ts            (the barrel's runtime export list)
packages/ai/package.json                 (workspace deps, ./globals.css export)
pnpm-lock.yaml
apps/storybook/stories/ai/conversation.stories.tsx
apps/storybook/stories/ai/conversation.mdx
docs/architecture/ai/capability-map.md   (spec table row)
```

## Commands

```
pnpm install
pnpm test:run packages/ai
pnpm run build --filter=@uiid/ai
ls packages/ai/dist/ai.css
grep -r '"ai"' packages/ai/dist
pnpm run lint && pnpm run format:check
pnpm size
pnpm --filter @uiid/storybook dev
```

## Testing strategy

Vitest with happy-dom, which has `ResizeObserver` and `scrollTo` but no layout, so the tests drive the hook the way `packages/tables/src/table/table.test.tsx` drives `useScrollAffordance`: scroll metrics are set with `Object.defineProperty`, scroll events are dispatched by hand, and `scrollTo` is spied on because a call to it is the hook's only observable output in a DOM that cannot scroll. `ResizeObserver` is replaced for the file with a small fake that records what was observed and lets a test fire the callback, so resize paths run through the real hook rather than a mock of it. All in `conversation.test.tsx`, through the real parts:

- The root has `role="log"` and `data-slot="conversation"`, the viewport, content and empty state carry their slots, and the button is absent at first.
- The fake observer has observed both the viewport and the content. Unmounting disconnects it.
- Firing the observer while pinned calls `scrollTo` with `top` equal to `scrollHeight` and `behavior: "instant"`. Firing it after a release calls nothing.
- A scroll event with a lower `scrollTop` and a distance past the threshold shows the button. A further scroll down that stays past the threshold leaves it showing. A scroll back within the threshold hides it.
- A scroll event with a higher `scrollTop` past the threshold, the shape of a smooth scroll in progress, does not show the button.
- A scroll event whose metrics land at distance zero after a lower `scrollTop`, the shape of a content shrink, does not show the button.
- Clicking the button calls `scrollTo` with `top` equal to `scrollHeight` and no `behavior`, and the button disappears. It is a `button` with the default label, and a caller's `aria-label`, `variant` and children replace the defaults.
- `ConversationContent` passes `gap`, `p` and `className` through as `data-ui-*` and a merged class, with the defaults in place when nothing is passed.
- `ConversationEmptyState` renders the default title and description, a custom title, description and icon, and `children` in place of all three.
- `useConversation` throws its named error outside `Conversation`.
- The barrel's runtime exports are exactly `Conversation`, `ConversationContent`, `ConversationEmptyState`, `ConversationScrollButton`, `Markdown`, `useConversation` and `useStickToBottom`.

Checked by hand in Storybook: the `Streaming` story opens at the bottom with no flash, follows the stream, releases on a scroll up, shows the button, re-pins on press with a smooth scroll, and re-pins on a manual scroll back down. Reduced motion is emulated to confirm the instant scroll. The `EmptyState` story is checked for centering in both axes and for its secondary text reading as gray on the page background in both themes.

## Boundaries

- **Always:** keep `"use client"` on the component and hook files only; keep the button a sibling of the content; set `data-slot` on every part; route reduced motion through CSS `scroll-behavior`; compose consumer refs with `useComposedRefs` rather than dropping them.
- **Ask first:** adding `use-stick-to-bottom` or any scroll library; any animation beyond the browser's smooth scroll; an options object on the hook; raising the size limit again; the design-system `globals.css` import before row 10 lands.
- **Never:** inline styles for position or spacing; a `MutationObserver` in place of the `ResizeObserver`; porting `ConversationDownload`; `overflow-anchor` as the mechanism, which Safari does not support.

## Success criteria

- Every acceptance criterion above holds.
- `pnpm test:run packages/ai`, `pnpm run build --filter=@uiid/ai`, `pnpm run lint`, `pnpm run format:check` and `pnpm size` pass, the last against the raised entry.
- `packages/ai/dist/ai.css` exists and `grep -r '"ai"' packages/ai/dist` returns nothing.
- The four parts and both hooks are exported from `@uiid/ai`, with `Basic`, `Streaming` and `EmptyState` stories and a README-backed MDX page under `apps/storybook/stories/ai/`.

## Follow-ups, not in this module

- `ai-message` renders inside `ConversationContent`. The examples here use `Text` and `Markdown` for messages because `Message` does not exist yet, and can switch once it does.
- `ai-prompt-input` can call `useConversation().scrollToBottom()` on submit, which is what upstream's `ChatBox` does with the library context.
- If a `Reasoning` or `Tool` panel ever needs its own pinned scroller, `useStickToBottom` is exported for it and would be the moment to give the hook an options object.

## Open questions

All three were settled at approval on 2026-10-28, each as recommended:

1. **Resize follow is an instant jump.** Upstream glides to the new bottom with a spring on each token. This spec jumps, which is what most chat UIs do and what keeps the hook to a few dozen lines. If the Streaming story looks harsh, the fix is a CSS transition on the content, not a JS animation.
2. **The button's default look** is `shape="circle"`, `variant="subtle"`, `size="small"`, centered 1 rem above the bottom edge. Every value is overridable by props.
3. **Both hooks are exported.** The ticket names `useStickToBottom` as a deliverable and the follow-ups above have a use for it; `useConversation` is the context accessor.
4. **The `@uiid/ai` size limit.** `Button` is a required reuse and costs about 40 kB in the measurement, so the `40 kB` entry could not hold. Settled at `80 kB` on 2026-10-28: headroom for `ai-message` and `ai-prompt-input`, which reuse buttons and forms already measured elsewhere, so neither should need its own bump. `ai-reasoning-tool` revisits it if `@uiid/code` arrives.
