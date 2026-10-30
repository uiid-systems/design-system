# Spec: `ai-message`

**Module:** `ai-message` (see [capability map](./capability-map.md))
**Package:** `@uiid/ai`
**Status:** Approved
**Upstream:** `ai-elements/packages/elements/src/message.tsx` and `suggestion.tsx` at `ca8be60`
**Depends on:** `ai-scaffold`, `markdown`

## Objective

`Message` is one turn of a chat. A user turn sits at the end of the column in a filled bubble; an assistant turn sits at the start as plain prose. Inside it, `MessageContent` holds the body and `MessageResponse` renders a streaming markdown reply through `Markdown`. `Suggestion` is the pill a reader presses to send a canned prompt; it usually sits under the empty state or the last assistant turn.

It is a trimmed port, and the trim is deliberate: the API starts small. Upstream's `message.tsx` is mostly `MessageBranch`, a context-driven carousel over alternate responses, which the capability map rules out, and its `MessageResponse` is `streamdown` with four plugins, which `SPEC-markdown.md` replaced with `markdown-to-jsx`. Upstream's `MessageActions`, `MessageAction` and `MessageToolbar` are a `Group` and a `Button` with two or three defaults each; here an actions row is a `Group` of `Button`s, shown in the examples, and each of those parts can be added later without a breaking change if a name for it earns its keep. Upstream's `suggestion.tsx` wraps its pills in a shadcn `ScrollArea`; there is no `ScrollArea` in `@uiid`, so the `Suggestions` container is a plain `Group` in the examples and not a part. What remains is three layout parts and one chip, and every one of them is an existing `@uiid` component with defaults and a `data-slot`.

**Acceptance criteria:**

- `<Message from="user">` and `<Message from="assistant">` render with distinct alignment and surface. The user turn has `margin-inline-start: auto`, aligns its children to the end, and its `MessageContent` is a filled, rounded, padded bubble. The assistant turn aligns to the start and its content has no surface. `from="system"` renders like `assistant`.
- `MessageResponse` renders a markdown string cut off at any point without throwing, with `streaming` forwarded to `Markdown`. A finished message with the same props does not recompile its markdown when the transcript around it re-renders.
- `Suggestion` is a `Button` that defaults to `variant="subtle"`, `shape="pill"`, `size="small"` and `type="button"`. `onClick` is the native handler, untouched. Every `Button` prop passes through, including `color`, `disabled`, `render` and `ref`.
- Every part writes a `data-slot`: `message`, `message-content`, `message-response`, `suggestion`. `Message` also writes `data-from`. Every part accepts `className`, `render` and `ref` and passes its host component's props through.
- The examples show an actions row under an assistant turn as a `Group` of ghost, square, xsmall `Button`s named by their `tooltip`, with no part of this module involved.
- No part holds state and no part needs a hook, so no file carries `"use client"`. The one new runtime import is `memo` from React. No new dependency in `packages/ai/package.json`.
- `pnpm size` passes against the existing `80 kB` entry.

## API

```ts
// message.types.ts
import type { StackProps } from "@uiid/layout";

import type { ChatRole } from "../ai.types";
import type { MarkdownProps } from "../markdown/markdown.types";

export type MessageProps = StackProps & {
  /** Who sent the turn. Drives alignment and the content surface. */
  from: ChatRole;
};

/** The body of a turn. A user turn's content is the bubble. */
export type MessageContentProps = StackProps;

/** A streaming markdown reply. `Markdown`, memoized per message. */
export type MessageResponseProps = MarkdownProps;

// suggestion.types.ts
import type { ButtonProps } from "@uiid/buttons";

/** A `Button` with subtle, pill and small defaults. */
export type SuggestionProps = ButtonProps;
```

The prop is `from`, not `role`. `StackProps` extends the HTML attributes, which already have `role` as the ARIA attribute, and a `Message` may legitimately need one, so the author lives under upstream's name. `ChatRole` comes from `ai.types.ts`; no `ai` SDK import.

Usage, which is upstream's shape with the branch parts, the action parts and the scroll area removed:

```tsx
<Conversation h={480}>
  <ConversationContent>
    {messages.map((message) => (
      <Message key={message.id} from={message.role}>
        <MessageContent>
          <MessageResponse streaming={message.id === streamingId}>
            {message.text}
          </MessageResponse>
        </MessageContent>
        {message.role === "assistant" && (
          <Group gap={1}>
            <Button variant="ghost" shape="square" size="xsmall" tooltip="Copy" onClick={() => copy(message.text)}>
              <CopyIcon />
            </Button>
            <Button variant="ghost" shape="square" size="xsmall" tooltip="Retry" onClick={() => regenerate(message.id)}>
              <RefreshCwIcon />
            </Button>
          </Group>
        )}
      </Message>
    ))}
  </ConversationContent>
  <ConversationScrollButton />
</Conversation>

<Group gap={2} wrap>
  {suggestions.map((text) => (
    <Suggestion key={text} onClick={() => sendMessage({ text })}>
      {text}
    </Suggestion>
  ))}
</Group>
```

Exports from the barrel: `Message`, `MessageContent`, `MessageResponse`, `Suggestion` and the four prop types.

## Implementation notes

### Structure

```
[data-slot=message][data-from=user]     Stack, gap 2, fullwidth, ax end,   max-width 95%, margin-inline-start auto
  [data-slot=message-content]           Stack, gap 2,                      min-width 0, max-width 100%, bubble surface
    [data-slot=message-response]        Markdown
  (caller's Group of Buttons)           not a part

[data-slot=message][data-from=assistant]  the same, ax start, no margin, no bubble

[data-slot=suggestion]                  Button subtle pill small
```

`Message` is a `Stack` with `gap = 2`, `fullwidth` and `ax = from === "user" ? "end" : "start"` destructured as defaults so a caller's values win, as the conversation parts do. It writes `data-from={from}` and merges the module's `message` class. `fullwidth` matters outside `ConversationContent`: `Stack` is `inline-flex` with `align-items: flex-start`, so without it a `Message` in a plain `Stack` would shrink to its content and the user turn could not reach the end. The module adds `max-width: 95%`, upstream's gutter, and `margin-inline-start: auto` for the user turn. `margin-inline-start` rather than `margin-left` so the turn flips in a right-to-left document.

`MessageContent` is a `Stack` with `gap = 2`. Inside a `Message` whose `ax` is `start` or `end` it is already shrink-to-fit, which is upstream's `w-fit`; the module adds `min-width: 0` and `max-width: 100%` so a long code block wraps or scrolls inside the turn instead of widening it. The bubble is one descendant rule: `:where(.message)[data-from="user"] .content` sets `background-color: var(--shade-surface)`, `color: var(--shade-foreground)`, `border-radius: var(--globals-border-radius)` and `padding: calc(var(--spacing-unit) * 3) calc(var(--spacing-unit) * 4)`, which is upstream's `py-3 px-4`. `MessageContent` does not know `from`; the root's attribute carries it, as upstream's `group-[.is-user]` does. The padding is in CSS rather than `px`/`py` props for that reason: the content cannot branch on a value it does not have, and a context to pass one value down for one rule is more mechanism than the rule.

`MessageContent` is not `Card`. A bubble has no title, description, action or footer, and `Card` paints a border and a shadow that a bubble would have to turn off. It is a surface on a `Stack`, the same way `ConversationEmptyState` is centered text on a `Stack`.

`MessageResponse` is `memo(Markdown)` with the slot: a component that renders `<Markdown data-slot="message-response" {...props} />`, wrapped in React's `memo` with its default shallow comparison. `Markdown` recompiles its string on every render, which is the right thing for the one message that is streaming and wasted work for the twenty finished messages above it that re-render with the transcript on every token. Upstream's custom comparator looks only at `children` and `isAnimating`, so a changed `className` is ignored there; the default comparison has no such hole. `Markdown` sets `data-slot="markdown"` before spreading its props, so the attribute passed here wins. `Prose` already zeroes the first child's top margin and scrolls a wide `pre`, so the part needs no CSS. `memo` is a plain function call, not a hook, so the file stays server-compatible.

An actions row is not a part. The README and examples show `<Group gap={1}>` holding `Button variant="ghost" shape="square" size="xsmall"` with a string `tooltip`, which on a square button is also its accessible name, through `Button`'s own prop. A toolbar that puts metadata on the other side is the same `Group` with `ax="space-between"` and `fullwidth`. That is everything upstream's `MessageActions`, `MessageAction` and `MessageToolbar` did once their Tailwind is gone, and the prompt-input spec set the precedent by dropping `PromptInputButton` for the same reason. If a product later wants a named `MessageAction` for its slot or its defaults, it is a `Button` wrapper in a new file and changes nothing here.

`Suggestion` is a `Button` with `variant = "subtle"`, `shape = "pill"`, `size = "small"` and `type = "button"` destructured as defaults, plus `data-slot="suggestion"`. Upstream recasts `onClick` to `(suggestion: string) => void` and takes the text as a `suggestion` prop; that recasts a prop the primitive ships, which the component conventions forbid, and a closure in the caller's `map` gives the handler the same string. So `onClick` is native and the text is `children`. Upstream's `cursor-pointer` and `rounded-full` are `Button`'s own cursor and `shape="pill"`.

### CSS

`message.module.css` holds three rules: `.message` with `max-width`, `:where(.message)[data-from="user"]` with the margin, and `:where(.message)[data-from="user"] .content` with the bubble. `.content` holds the two width declarations. The data attribute is selected inside `:where(.message)` so the module stays pure for the docs build, as `.agents/styling.md` requires. No variants file: `from` is written as an attribute and styled by attribute, like `data-status` on `PromptInput`, because the same attribute is the consumer's styling hook and `system` and `assistant` need no class. No new tokens: the four values are existing globals and shade tokens. `Suggestion` ships no CSS.

The design-system `globals.css` import stays deferred with scaffold rows 10 and 11, as the conversation and prompt-input specs set out.

### The conversation examples

`conversation.examples.tsx` carries a local `Message` placeholder, labeled in the conversation spec as the thing `ai-message` replaces once it exists. This module makes that swap: the placeholder goes, and `Basic` and `Streaming` render `Message`, `MessageContent` and `MessageResponse`. That is the one file outside `message/`, `suggestion/` and the barrel that changes, and the conversation tests assert on text the swap keeps.

### Package

No new dependency. `@uiid/buttons`, `@uiid/layout`, `@uiid/typography` and `@uiid/utils` are already dependencies; `@uiid/icons` is used by the examples only, through its per-icon subpaths. `Button` was already in the size measurement from `ConversationScrollButton`, so `pnpm size` should move by the parts' own code only.

## Files

```
packages/ai/
  src/index.ts                                      (Message, Suggestion exports)
  src/index.test.ts                                 (the barrel's runtime export list)
  src/message/
    message.tsx
    message.types.ts
    message.module.css
    message.test.tsx
    message.examples.tsx
    README.md
    subcomponents/
      index.ts
      message-content.tsx
      message-response.tsx
  src/suggestion/
    suggestion.tsx
    suggestion.types.ts
    suggestion.test.tsx
    suggestion.examples.tsx
    README.md
  src/conversation/conversation.examples.tsx        (placeholder Message replaced)
apps/storybook/stories/ai/
  message.stories.tsx
  message.mdx
  suggestion.stories.tsx
  suggestion.mdx
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

Vitest with happy-dom. `conversation.test.tsx` is the template: structure through `data-slot`, style props through `data-ui-*` attributes, variants through the host's class names, and an examples render test.

**Message:**

- The root is a `Stack` with `data-slot="message"`, `data-from` equal to `from`, `data-ui-gap="2"` and `data-ui-fullwidth`. `from="user"` writes `data-ui-ay="end"` (a `Stack`'s `ax` lands on the `ay` attribute, as the conversation test shows), and `assistant` and `system` write `start`. A caller's `ax`, `gap` and `className` win, and `ref` reaches the root.
- The module's class is on the root, so the user margin and bubble rules can attach. happy-dom does no layout, so the surface is checked by hand.

**MessageContent:** writes its slot and `data-ui-gap="2"`, passes `className` and `ref` through, and takes `render`.

**MessageResponse:**

- Renders a `Prose` root with `data-slot="message-response"` and the markdown as elements.
- A string cut off inside `**`, inside a link and inside a code fence renders without throwing, with `streaming` and without.
- `streaming` forwards: a trailing unclosed `**word` is plain text with `streaming` and shows the delimiter without it, which is the behavior `markdown.test.tsx` already pins on `Markdown`.
- Re-rendering a parent with unchanged props does not call the compiler again. Spy on `markdown-to-jsx/react`'s `compiler` through `vi.mock` and count calls across a parent state change; a changed `children` compiles once more.

**Suggestion:**

- A `button` with `type="button"`, `data-slot="suggestion"`, and the `variant-subtle`, `shape-pill` and `size-small` classes, with `children` as its text.
- `onClick` receives the click event; `variant`, `size` and `disabled` pass through.

**Barrel:** the runtime export list gains the four parts, in `index.test.ts`.

**Examples:** every export of `message.examples.tsx` and `suggestion.examples.tsx` renders without throwing, the actions example renders buttons named by their tooltips, and the conversation examples still render the text their test looks for.

**Checked by hand in Storybook**, since happy-dom does no layout: the user bubble sits at the end with the gutter and the assistant prose at the start, in both themes; a long user line wraps inside the bubble and a wide code block scrolls inside the turn; the `Streaming` story shows no layout jump as a reply arrives; the actions row aligns under the assistant prose's start; a tooltip opens on hover and focus; pills wrap in a `Group`.

## Boundaries

- **Always:** build every part on an existing `@uiid` component; `ChatRole` from `ai.types.ts`; `Button`'s `tooltip` for tooltips; `Markdown` for the response; `data-slot` on every part; `:where(.message)[data-from]` for the role rules.
- **Ask first:** a `MessageActions`, `MessageAction` or `MessageToolbar` part; a `Suggestions` scroller or any horizontal-scroll CSS; a context between `Message` and its parts; an avatar or author-name part; a `MessageContent` `variant`; any new token; raising the `80 kB` limit; any change to `Button`, `Stack` or `Markdown`.
- **Never:** `MessageBranch` or `ConversationDownload`; `streamdown` or any markdown plugin; a recast `onClick`; a `role` prop; `Card` for the bubble; inline styles; an `ai` SDK import.

## Success criteria

- Every acceptance criterion above holds.
- `pnpm test:run packages/ai` passes, with the markdown, conversation and prompt-input tests unchanged apart from the conversation examples swap.
- `pnpm run build --filter=@uiid/ai`, `pnpm run lint`, `pnpm run format:check` and `pnpm size` pass.
- Storybook has `AI/Message` stories covering a user and an assistant turn, a streaming response, an actions row of plain `Button`s, and a full transcript inside `Conversation`, and `AI/Suggestion` stories covering a row of pills and a composition with `ConversationEmptyState`, each backed by its README.

## Follow-ups, not in this module

- `ai-reasoning-tool` renders inside `MessageContent`; its spec follows this one.
- `MessageAction`, `MessageActions` or `MessageToolbar` as named parts, if the examples' `Group` of `Button`s turns out to repeat across products. Each is additive.
- A `Suggestions` scroller, if a single-row design is wanted later. It would be `Group` with `nowrap` and `overflow-x: auto` and belongs with a decision on scrollbars.
- An avatar or author line, if the product design calls for one. Upstream has none either.
- Publishing `@uiid/ai`, the POC's final step, its own PR.

## Resolved decisions

1. **`from`, not `role`.** The ticket says the layout is "driven by `role`", and it is, through the `ChatRole` type; the prop is named `from` because `role` is the ARIA attribute on every `Stack` and a message may need it.
2. **Alignment and surface are one attribute and three CSS rules.** `data-from` on the root, `:where(.message)[data-from="user"]` for the margin and the bubble. No variants file, no context, no `from` on `MessageContent`.
3. **The bubble is a `Stack` with a surface, not a `Card`.** A `Card` brings a border, a shadow and five slots a bubble turns off or ignores.
4. **`MessageResponse` is `memo(Markdown)` with default comparison.** Finished messages skip their recompile on every token of the one that is streaming; a changed `className` still re-renders, which upstream's comparator misses.
5. **No `MessageActions`, `MessageAction` or `MessageToolbar`.** Each was a `Group` or `Button` with two or three defaults and a slot. The API starts small: an actions row is a `Group` of `Button`s in the examples, and any of the three can be added later without a breaking change. Settled on 2026-10-29 at the first review of this spec.
6. **`Suggestion` stays, with the native `onClick` and its text as `children`.** It is in the ticket's title and it is the one chip a chat needs by name. Upstream's `onClick(suggestion)` recasts a prop the primitive ships; a closure in the caller's `map` gives the handler the same string with nothing recast.
7. **No `Suggestions` part.** The ticket lists `Suggestion` only, `@uiid` has no `ScrollArea`, and a row of pills that wraps in a `Group` needs no hidden scrollbar.
8. **The conversation examples switch to the real `Message` here.** The conversation spec named this as the moment, and leaving a placeholder `Message` next to a real one would mislead the next reader.

## Open questions

None.
