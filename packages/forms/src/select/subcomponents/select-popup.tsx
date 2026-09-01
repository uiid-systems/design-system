"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import type { SelectPopupProps } from "../select.types";

import styles from "../select.module.css";

/**
 * The popup is portalled, so no class on the trigger can reach it — the hue has
 * to arrive as a prop. `Card` already paints the palette, so the treatment is a
 * pass-through; leaving `color` undefined lands on `Card`'s neutral default.
 */
export const SelectPopup = ({
  children,
  className,
  color,
  ...props
}: SelectPopupProps) => {
  return (
    <BaseSelect.Popup
      data-slot="select-popup"
      render={<Card color={color} p={2} gap={0} fullwidth />}
      className={cx(styles["select-popup"], className)}
      {...props}
    >
      {children}
    </BaseSelect.Popup>
  );
};
SelectPopup.displayName = "SelectPopup";
