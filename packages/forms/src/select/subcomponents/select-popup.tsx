import { Select as BaseSelect } from "@base-ui-components/react/select";

import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import type { SelectPopupProps } from "../select.types";
import styles from "../select.module.css";

export const SelectPopup = ({
  children,
  className,
  ...props
}: SelectPopupProps) => {
  return (
    <BaseSelect.Popup
      data-slot="select-popup"
      render={<Card size="sm" p={2} fullwidth data-is-popup />}
      className={cx(styles["select-popup"], className)}
      {...props}
    >
      {children}
    </BaseSelect.Popup>
  );
};
SelectPopup.displayName = "SelectPopup";
