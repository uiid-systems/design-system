import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { StatusProps } from "./status.types";
import { statusVariants } from "./status.variants";

import styles from "./status.module.css";

export const Status = ({
  pulse,
  inverted,
  color,
  className,
  children,
  ...props
}: StatusProps) => {
  return (
    <Group
      data-slot="status"
      className={cx(styles["status"], className)}
      ay="center"
      gap={2}
      {...props}
    >
      <span
        data-slot="status-dot"
        data-colored={color ? "" : undefined}
        className={cx(
          styles["status-dot"],
          statusVariants({ pulse, inverted, color }),
        )}
      />
      {children && (
        <Text data-slot="status-text" size={0}>
          {children}
        </Text>
      )}
    </Group>
  );
};
Status.displayName = "Status";
