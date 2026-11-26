import { Menu as BaseMenu } from "@base-ui/react/menu";
import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import type { MenuPopupProps } from "../menu.types";

import styles from "../menu.module.css";

/**
 * Renders as the same `Card` the Select, Combobox and Autocomplete popups do,
 * with the same defaults. Menu rebuilds that surface rather than importing it:
 * the helper lives in `@uiid/forms`, which `@uiid/navigation` does not depend on.
 *
 * `p`, `gap` and `w` are destructured and handed to the `Card` rather than
 * spread onto the part: Base UI merges the `render` element's props over the
 * part's, so a default written there would beat the caller's.
 */
export const MenuPopup = ({
  className,
  color,
  p = 2,
  gap = 0,
  w = "full",
  children,
  ...props
}: MenuPopupProps) => {
  return (
    <BaseMenu.Popup
      data-slot="menu-popup"
      render={<Card shadow color={color} p={p} gap={gap} w={w} />}
      className={cx(styles["popup"], className)}
      {...props}
    >
      {children}
    </BaseMenu.Popup>
  );
};
MenuPopup.displayName = "MenuPopup";
