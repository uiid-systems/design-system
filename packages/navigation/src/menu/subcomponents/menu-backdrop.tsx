import { Menu as BaseMenu } from "@base-ui/react/menu";
import { cx } from "@uiid/utils";

import type { MenuBackdropProps } from "../menu.types";

import styles from "../menu.module.css";

export const MenuBackdrop = ({ className, ...props }: MenuBackdropProps) => {
  return (
    <BaseMenu.Backdrop
      data-slot="menu-backdrop"
      className={cx(styles["backdrop"], className)}
      {...props}
    />
  );
};
MenuBackdrop.displayName = "MenuBackdrop";
