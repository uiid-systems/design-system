import { Menu as BaseMenu } from "@base-ui/react/menu";

import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { SubmenuTriggerProps } from "../menu.types";
import styles from "../menu.module.css";

export const SubmenuTrigger = ({
  className,
  children,
  ...props
}: SubmenuTriggerProps) => {
  return (
    <BaseMenu.SubmenuTrigger
      data-slot="submenu-trigger"
      render={<Group gap={4} ay="center" ax="space-between" />}
      className={cx(styles["submenu-trigger"], className)}
      {...props}
    >
      {children}
    </BaseMenu.SubmenuTrigger>
  );
};
SubmenuTrigger.displayName = "SubmenuTrigger";
