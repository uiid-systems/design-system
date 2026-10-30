"use client";

import { Button } from "@uiid/buttons";
import { ArrowDownIcon } from "@uiid/icons/arrow-down";
import { cx } from "@uiid/utils";

import { useConversation } from "../conversation.context";
import type { ConversationScrollButtonProps } from "../conversation.types";

import styles from "../conversation.module.css";

export const ConversationScrollButton = ({
  className,
  children = <ArrowDownIcon />,
  onClick,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useConversation();

  if (isAtBottom) return null;

  return (
    <Button
      data-slot="conversation-scroll-button"
      shape="circle"
      variant="subtle"
      size="small"
      aria-label="Scroll to bottom"
      className={cx(styles["scroll-button"], className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) scrollToBottom();
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
ConversationScrollButton.displayName = "ConversationScrollButton";
