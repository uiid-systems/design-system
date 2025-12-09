import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import type { BadgeProps } from "./badge.types";
import styles from "./badge.module.css";

export const Badge = ({
  size = "sm",
  variant,
  children,
  ...props
}: BadgeProps) => {
  return (
    <Group
      data-slot="badge"
      ay="center"
      gap={1}
      data-variant={variant}
      className={styles["badge"]}
      {...props}
    >
      <span data-slot="badge-indicator" className={styles["badge-indicator"]} />
      <Text data-slot="badge-text" level={-1} className={styles["badge-text"]}>
        {children}
      </Text>
    </Group>
  );
};
Badge.displayName = "Badge";
