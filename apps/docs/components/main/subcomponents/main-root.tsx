import { cx, Group } from "@uiid/design-system";

import type { MainRootProps } from "../main.types";

import styles from "../main.module.css";

/** The scroll track: the page and its aside scroll together here. */
export const MainRoot = ({ className, children, ...props }: MainRootProps) => {
  return (
    <Group
      data-slot="main"
      className={cx(styles["main"], className)}
      ay="start"
      w="full"
      grow
      {...props}
    >
      {children}
    </Group>
  );
};
MainRoot.displayName = "MainRoot";
