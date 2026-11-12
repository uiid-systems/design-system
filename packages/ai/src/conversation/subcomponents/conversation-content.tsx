"use client";

import { Stack } from "@uiid/layout";
import { cx, useComposedRefs } from "@uiid/utils";

import { useConversation } from "../conversation.context";
import type { ConversationContentProps } from "../conversation.types";

import styles from "../conversation.module.css";

export const ConversationContent = ({
  ref,
  viewportRef,
  ax = "stretch",
  fullwidth = true,
  gap = 8,
  p = 4,
  className,
  ...props
}: ConversationContentProps) => {
  const { scrollRef, contentRef } = useConversation();
  const composedRef = useComposedRefs(contentRef, ref);
  const composedViewportRef = useComposedRefs(scrollRef, viewportRef);

  return (
    /* Focusable so the keyboard can scroll it (Safari does not make a scroll
       container focusable on its own), and so the scroll button has somewhere
       to hand focus when it unmounts. The log role sits on the column, not the
       region, so the scroll button appearing is not announced as a message. */
    <div
      data-slot="conversation-viewport"
      ref={composedViewportRef}
      tabIndex={0}
      className={styles["viewport"]}
    >
      <Stack
        data-slot="conversation-content"
        role="log"
        aria-label="Conversation"
        ref={composedRef}
        ax={ax}
        fullwidth={fullwidth}
        gap={gap}
        p={p}
        className={cx(styles["content"], className)}
        {...props}
      />
    </div>
  );
};
ConversationContent.displayName = "ConversationContent";
