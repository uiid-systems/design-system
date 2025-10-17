import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import type { StatusProps } from "./status.types";
import styles from "./status.module.css";

export const Status = ({ variant, pulse, children }: StatusProps) => {
  return (
    <Group
      uiid="status"
      ay="center"
      gap={2}
      data-variant={variant}
      className={styles.status}
    >
      <span data-slot="status-dot" data-pulse={pulse} />
      <Text data-slot="status-text" level={0}>
        {children}
      </Text>
    </Group>
  );
};
Status.displayName = "Status";
