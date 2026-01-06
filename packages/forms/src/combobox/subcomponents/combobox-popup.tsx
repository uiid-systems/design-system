import { Combobox as BaseCombobox } from "@base-ui/react/combobox";

import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import type { ComboboxPopupProps } from "../combobox.types";
import styles from "../combobox.module.css";

export const ComboboxPopup = ({
  children,
  className,
  ...props
}: ComboboxPopupProps) => {
  return (
    <BaseCombobox.Popup
      data-slot="combobox-popup"
      render={<Card p={2} gap={0} fullwidth data-is-popup />}
      className={cx(styles["combobox-popup"], className)}
      {...props}
    >
      {children}
    </BaseCombobox.Popup>
  );
};
ComboboxPopup.displayName = "ComboboxPopup";
