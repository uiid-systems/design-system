# Conversation

> The scroll region of a chat. While a reply streams in, it stays pinned to the newest content. When the reader scrolls up, it lets go and leaves them where they are, and a button appears to bring them back down. The pinning is a local hook, `useStickToBottom`, with no dependency behind it.

Use Conversation when you want to:

- Keep the newest message in view while tokens arrive, including when the region itself shrinks under a growing prompt input
- Let a reader scroll up to re-read without the stream dragging them back down
- Offer one press back to the bottom, with a smooth scroll that turns instant under `prefers-reduced-motion`

Reach for a plain `Stack` when the content does not grow while it is on screen.

## Usage

```tsx
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@uiid/ai";

<Conversation h={480}>
  <ConversationContent>
    {messages.length === 0 ? (
      <ConversationEmptyState />
    ) : (
      messages.map((message) => <Message key={message.id} {...message} />)
    )}
  </ConversationContent>
  <ConversationScrollButton />
</Conversation>;
```

`ConversationScrollButton` is a sibling of `ConversationContent`, not a child, so it anchors to the region instead of scrolling away with the messages. `ConversationEmptyState` goes inside `ConversationContent`, where it centers in the region's full height.

`Conversation` does not size itself. Give it a height with `h`, `fullheight`, or `grow` inside a `Stack`.

## Parts

### Conversation

The region. All [`Box`](../../../layout/src/box/README.md) props. Renders with `role="log"` and `data-slot="conversation"`.

### ConversationContent

The column of messages. All [`Stack`](../../../layout/src/stack/README.md) props, with `ax="stretch"`, `fullwidth`, `gap={8}` and `p={4}` as defaults, so messages span the region. Renders `data-slot="conversation-content"` inside an internal scroller, `data-slot="conversation-viewport"`.

### ConversationEmptyState

All `Stack` props, plus:

| Prop          | Type        | Default                                       | Description                              |
| ------------- | ----------- | --------------------------------------------- | ---------------------------------------- |
| `title`       | `string`    | `"No messages yet"`                           | Heading                                  |
| `description` | `string`    | `"Start a conversation to see messages here"` | Supporting line under the heading        |
| `icon`        | `ReactNode` | —                                             | Icon rendered above the heading          |
| `children`    | `ReactNode` | —                                             | Replaces the icon, title and description |

### ConversationScrollButton

All [`Button`](../../../buttons/src/button/README.md) props. Renders only while the reader is scrolled up, as a small subtle circle with an arrow and the label "Scroll to bottom". Pass `aria-label`, `variant`, `size` or `children` to change any of that.

## Behavior

The region starts pinned and opens at its newest message. While pinned, content growing or the region shrinking keeps the bottom in view with an instant jump.

Scrolling up past 70 px from the bottom releases the pin. The button appears, and content that arrives afterwards does not move the reader. Scrolling back within that band re-pins without pressing anything. The button scrolls to the bottom and re-pins; its scroll is smooth by default and instant under `prefers-reduced-motion: reduce`, through the scroller's CSS `scroll-behavior`.

A smooth scroll in progress never releases itself, and content that shrinks while pinned never releases either. A transcript shorter than the region is always pinned, so the button never shows for it.

## Hooks

`useConversation()` returns the region's `isAtBottom` and `scrollToBottom` to anything rendered inside `Conversation`, and throws outside it. A prompt input can call `scrollToBottom()` on submit.

`useStickToBottom()` is the hook behind `Conversation`, exported for a scroller of your own. Attach `scrollRef` to the element that scrolls and `contentRef` to the element that grows, and it returns the same `isAtBottom` and `scrollToBottom`.

## Notes

- The scroll button is positioned against the region, centered 1 rem above its bottom edge.
- `Conversation`, `ConversationContent` and `ConversationScrollButton` are client components. `ConversationEmptyState` has no state and renders on the server.
- The server render is the pinned state, so the button is absent from server HTML.
