import { Menu as BaseMenu } from "@base-ui/react/menu";
import { CheckIcon } from "@uiid/icons/check";
import { cx } from "@uiid/utils";

import type { MenuCheckboxItemIndicatorProps } from "../menu.types";

import styles from "../menu.module.css";

/**
 * Drawn as the same check Select's rows use. It stays mounted while unchecked
 * and is hidden by `choice-indicator`, so it holds its space in every row.
 */
export const MenuCheckboxItemIndicator = ({
  className,
  keepMounted = true,
  render = <CheckIcon />,
  ...props
}: MenuCheckboxItemIndicatorProps) => {
  return (
    <BaseMenu.CheckboxItemIndicator
      data-slot="menu-checkbox-item-indicator"
      keepMounted={keepMounted}
      render={render}
      className={cx(styles["choice-indicator"], className)}
      {...props}
    />
  );
};
MenuCheckboxItemIndicator.displayName = "MenuCheckboxItemIndicator";
