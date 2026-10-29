import { Stack } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import {
  CONVERSATION_EMPTY_DESCRIPTION,
  CONVERSATION_EMPTY_TITLE,
} from "../conversation.constants";
import type { ConversationEmptyStateProps } from "../conversation.types";

import styles from "../conversation.module.css";

export const ConversationEmptyState = ({
  title = CONVERSATION_EMPTY_TITLE,
  description = CONVERSATION_EMPTY_DESCRIPTION,
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
    fullheight
    className={cx(styles["empty-state"], className)}
    {...props}
  >
    {children ?? (
      <>
        {icon && <Text emphasis="muted">{icon}</Text>}
        <Stack gap={1} ax="center">
          <Text weight="medium" render={<h3 />}>
            {title}
          </Text>
          {description && <Text emphasis="muted">{description}</Text>}
        </Stack>
      </>
    )}
  </Stack>
);
ConversationEmptyState.displayName = "ConversationEmptyState";
