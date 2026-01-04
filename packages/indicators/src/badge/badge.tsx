import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { BadgeProps } from "./badge.types";
import styles from "./badge.module.css";

export const Badge = ({
  size,
  variant,
  hideIndicator,
  className,
  children,
  ...props
}: BadgeProps) => {
  return (
    <Group
      data-slot="badge"
      ay="center"
      gap={1}
      data-variant={variant}
      data-size={size}
      className={cx(styles["badge"], className)}
      {...props}
    >
      {!hideIndicator && (
        <span
          data-slot="badge-indicator"
          className={styles["badge-indicator"]}
        />
      )}
      <Text
        data-slot="badge-text"
        className={styles["badge-text"]}
        size={-1}
        weight="bold"
      >
        {children}
      </Text>
    </Group>
  );
};
Badge.displayName = "Badge";
