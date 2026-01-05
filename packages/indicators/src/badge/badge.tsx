import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { BadgeProps } from "./badge.types";
import { badgeVariants } from "./badge.variants";
import styles from "./badge.module.css";

export const Badge = ({
  size,
  tone,
  inverted,
  hideIndicator,
  className,
  children,
  ...props
}: BadgeProps) => {
  return (
    <Group
      data-slot="badge"
      className={cx(
        styles["badge"],
        badgeVariants({ size, tone, inverted }),
        className,
      )}
      ay="center"
      gap={1}
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
