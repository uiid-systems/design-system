"use client";

import { Stack } from "@uiid/layout";
import { cx, useComposedRefs } from "@uiid/utils";

import { useConversation } from "../conversation.context";
import type { ConversationContentProps } from "../conversation.types";

import styles from "../conversation.module.css";

export const ConversationContent = ({
  ref,
  ax = "stretch",
  fullwidth = true,
  gap = 8,
  p = 4,
  className,
  ...props
}: ConversationContentProps) => {
  const { scrollRef, contentRef } = useConversation();
  const composedRef = useComposedRefs(contentRef, ref);

  return (
    <div
      data-slot="conversation-viewport"
      ref={scrollRef}
      className={styles["viewport"]}
    >
      <Stack
        data-slot="conversation-content"
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
