import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { StatusProps } from "./status.types";
import { statusVariants } from "./status.variants";

import styles from "./status.module.css";

/**
 * A status dot, with an optional label as children. The root is a `<span>`, so
 * it is valid inside a paragraph or a button.
 *
 * Without a label the dot is color only, so give it a name. `aria-label` needs
 * a role to be announced:
 *
 * @example
 * <Status role="img" aria-label="Online" color="green" />
 */
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
      render={<span />}
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
      {(children || children === 0) && (
        <Text data-slot="status-text" size={0}>
          {children}
        </Text>
      )}
    </Group>
  );
};
Status.displayName = "Status";
