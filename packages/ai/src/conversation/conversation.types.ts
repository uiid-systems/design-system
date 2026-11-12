import type { ButtonProps } from "@uiid/buttons";
import type { BoxProps, StackProps } from "@uiid/layout";

/** The scroll region. Size it from outside with `h` (a number or `"full"`) or `grow`. */
export type ConversationProps = BoxProps;

/**
 * The column of messages, a `role="log"` named "Conversation". Props go to the
 * inner `Stack`; pass `aria-label` or `aria-labelledby` to rename the log.
 * `viewportRef` reaches the scroller around it.
 */
export type ConversationContentProps = StackProps & {
  /**
   * The element that scrolls. `ref` is the message column inside it, which
   * grows rather than scrolls; listen here to load older history or to keep
   * the reader's place after prepending. Pass a `useRef` or a stable
   * callback: a new callback each render detaches and reattaches it.
   * Inside `Conversation`, `useConversation().scrollElement` is the same
   * element; use `viewportRef` from the component that owns the history.
   */
  viewportRef?: React.Ref<HTMLDivElement>;
};

export type ConversationEmptyStateProps = StackProps & {
  /** Heading. Defaults to "No messages yet". */
  title?: string;
  /** Level of the heading element, to fit the page's outline. Defaults to 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Supporting line under the heading. Defaults to "Start a conversation to see messages here". */
  description?: string;
  /** Icon rendered above the heading. */
  icon?: React.ReactNode;
};

/**
 * A `Button` that appears while the reader is scrolled up. Defaults to a
 * small, subtle circle with an arrow and the label "Scroll to bottom".
 * Pressing it while focused moves focus to the viewport, since the button
 * unmounts once the conversation is back at the bottom.
 */
export type ConversationScrollButtonProps = ButtonProps;

export type UseStickToBottomReturn = {
  /** Attach to the element that scrolls. */
  scrollRef: (node: HTMLElement | null) => void;
  /** Attach to the element whose size changes as content arrives. */
  contentRef: (node: HTMLElement | null) => void;
  /** The element attached to `scrollRef`, once it has mounted. */
  scrollElement: HTMLElement | null;
  /** Whether the container is pinned to its newest content. */
  isAtBottom: boolean;
  /** Re-pin and scroll to the newest content, following the container's `scroll-behavior`. */
  scrollToBottom: () => void;
};
