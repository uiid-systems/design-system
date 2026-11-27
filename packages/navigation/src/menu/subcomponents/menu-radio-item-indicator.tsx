import { Menu as BaseMenu } from "@base-ui/react/menu";
import { CheckIcon } from "@uiid/icons/check";
import { cx } from "@uiid/utils";

import type { MenuRadioItemIndicatorProps } from "../menu.types";

import styles from "../menu.module.css";

/**
 * Drawn as the same check the checkbox item and Select's rows use. It stays
 * mounted while unselected and is hidden by `choice-indicator`, so it holds
 * its space in every row.
 */
export const MenuRadioItemIndicator = ({
  className,
  keepMounted = true,
  render = <CheckIcon />,
  ...props
}: MenuRadioItemIndicatorProps) => {
  return (
    <BaseMenu.RadioItemIndicator
      data-slot="menu-radio-item-indicator"
      keepMounted={keepMounted}
      render={render}
      className={cx(styles["choice-indicator"], className)}
      {...props}
    />
  );
};
MenuRadioItemIndicator.displayName = "MenuRadioItemIndicator";
