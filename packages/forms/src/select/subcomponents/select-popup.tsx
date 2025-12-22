import { Select as BaseSelect } from "@base-ui-components/react/select";

import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import styles from "../select.module.css";

type SelectPopupProps = BaseSelect.Popup.Props;

export const SelectPopup = ({
  children,
  className,
  ...props
}: SelectPopupProps) => {
  return (
    <BaseSelect.Popup
      render={<Card size="sm" p={2} fullwidth data-is-popup />}
      className={cx(styles["select-popup"], className)}
      {...props}
    >
      {children}
    </BaseSelect.Popup>
  );
};
SelectPopup.displayName = "SelectPopup";
