"use client";

import { Button } from "@uiid/buttons";
import { ArrowDownIcon } from "@uiid/icons/arrow-down";
import { cx } from "@uiid/utils";

import { CONVERSATION_SCROLL_LABEL } from "../conversation.constants";
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
      type="button"
      shape="circle"
      variant="subtle"
      size="small"
      aria-label={CONVERSATION_SCROLL_LABEL}
      className={cx(styles["scroll-button"], className)}
      onClick={(event) => {
        onClick?.(event);
        scrollToBottom();
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
ConversationScrollButton.displayName = "ConversationScrollButton";
