import { Menu as BaseMenu } from "@base-ui/react/menu";

import { cx } from "@uiid/utils";

import type { MenuPopupProps } from "../menu.types";
import styles from "../menu.module.css";

export const MenuPopup = ({
  className,
  children,
  ...props
}: MenuPopupProps) => {
  return (
    <BaseMenu.Popup
      data-slot="menu-popup"
      className={cx(styles["popup"], className)}
      {...props}
    >
      {children}
    </BaseMenu.Popup>
  );
};
MenuPopup.displayName = "MenuPopup";
