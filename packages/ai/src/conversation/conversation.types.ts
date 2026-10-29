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

/**
 * A `Button` that appears while the reader is scrolled up. Defaults to a
 * small, subtle circle with an arrow and the label "Scroll to bottom".
 */
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
