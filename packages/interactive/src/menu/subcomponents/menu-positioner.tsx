import { Menu as BaseMenu } from "@base-ui/react/menu";

import { cx } from "@uiid/utils";

import type { MenuPositionerProps } from "../menu.types";
import styles from "../menu.module.css";

export const MenuPositioner = ({
  className,
  children,
  ...props
}: MenuPositionerProps) => {
  return (
    <BaseMenu.Positioner
      data-slot="menu-positioner"
      className={cx(styles["positioner"], className)}
      sideOffset={4}
      collisionPadding={16}
      {...props}
    >
      {children}
    </BaseMenu.Positioner>
  );
};
MenuPositioner.displayName = "MenuPositioner";
