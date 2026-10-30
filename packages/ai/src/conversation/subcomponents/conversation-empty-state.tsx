import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { ConversationEmptyStateProps } from "../conversation.types";

import styles from "../conversation.module.css";

export const ConversationEmptyState = ({
  title = "No messages yet",
  description = "Start a conversation to see messages here",
  icon,
  className,
  children,
  ...props
}: ConversationEmptyStateProps) => (
  <Stack
    data-slot="conversation-empty-state"
    ax="center"
    ay="center"
    gap={3}
    p={8}
    grow
    className={cx(styles["empty-state"], className)}
    {...props}
  >
    {children ?? (
      <>
        {icon && <Text color="neutral">{icon}</Text>}
        <Stack gap={1} ax="center">
          <Text weight="medium" render={<h3 />}>
            {title}
          </Text>
          {description && <Text color="neutral">{description}</Text>}
        </Stack>
      </>
    )}
  </Stack>
);
ConversationEmptyState.displayName = "ConversationEmptyState";
