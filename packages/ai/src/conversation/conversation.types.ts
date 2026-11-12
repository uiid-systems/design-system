import type { ButtonProps } from "@uiid/buttons";
import type { BoxProps, StackProps } from "@uiid/layout";

/** The scroll region. Size it from outside with `h` (a number or `"full"`) or `grow`. */
export type ConversationProps = BoxProps;

/**
 * The column of messages, a `role="log"` named "Conversation". Props go to the
 * inner `Stack`; pass `aria-label` or `aria-labelledby` to rename the log. The
 * scroller is internal.
 */
export type ConversationContentProps = StackProps;

export type ConversationEmptyStateProps = StackProps & {
  /** Heading. Defaults to "No messages yet". */
  title?: string;
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
