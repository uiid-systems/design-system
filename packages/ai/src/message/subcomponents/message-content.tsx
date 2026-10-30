import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { MessageContentProps } from "../message.types";

import styles from "../message.module.css";

export const MessageContent = ({
  gap = 2,
  className,
  ...props
}: MessageContentProps) => (
  <Stack
    data-slot="message-content"
    gap={gap}
    className={cx(styles["content"], className)}
    {...props}
  />
);
MessageContent.displayName = "MessageContent";
