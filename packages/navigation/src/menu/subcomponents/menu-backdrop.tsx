import { Menu as BaseMenu } from "@base-ui/react/menu";
import { cxState } from "@uiid/utils";

import type { MenuBackdropProps } from "../menu.types";

import styles from "../menu.module.css";

export const MenuBackdrop = ({ className, ...props }: MenuBackdropProps) => {
  return (
    <BaseMenu.Backdrop
      data-slot="menu-backdrop"
      className={cxState(styles["backdrop"], className)}
      {...props}
    />
  );
};
MenuBackdrop.displayName = "MenuBackdrop";
