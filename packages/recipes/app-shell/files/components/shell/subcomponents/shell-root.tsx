import { Group } from "@uiid/design-system";
import { cx } from "@uiid/design-system/utils";

import type { ShellRootProps } from "../shell.types";

import styles from "../shell.module.css";

/** The sidebar and the inner column, side by side at full height. */
export const ShellRoot = ({
  className,
  children,
  ...props
}: ShellRootProps) => {
  return (
    <Group
      data-slot="shell-root"
      className={cx(styles["shell-root"], className)}
      ay="stretch"
      w="full"
      grow
      {...props}
    >
      {children}
    </Group>
  );
};
ShellRoot.displayName = "ShellRoot";
