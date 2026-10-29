"use client";

import { Box } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { ConversationContext } from "./conversation.context";
import type { ConversationProps } from "./conversation.types";
import { useStickToBottom } from "./hooks/use-stick-to-bottom";

import styles from "./conversation.module.css";

export const Conversation = ({
  className,
  children,
  ...props
}: ConversationProps) => {
  const value = useStickToBottom();

  return (
    <ConversationContext.Provider value={value}>
      <Box
        data-slot="conversation"
        role="log"
        className={cx(styles["conversation"], className)}
        {...props}
      >
        {children}
      </Box>
    </ConversationContext.Provider>
  );
};
Conversation.displayName = "Conversation";
