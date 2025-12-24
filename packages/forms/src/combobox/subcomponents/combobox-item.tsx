import { Combobox as BaseCombobox } from "@base-ui-components/react/combobox";

import { ListItem } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { ComboboxItemProps } from "../combobox.types";
import styles from "../combobox.module.css";

export const ComboboxItem = ({
  value,
  className,
  children,
  ...props
}: ComboboxItemProps) => {
  return (
    <BaseCombobox.Item
      data-slot="combobox-item"
      value={value}
      className={cx(styles["combobox-item"], className)}
      render={(_, state) => (
        <ListItem
          render={<div />}
          fullwidth
          label={value}
          value={value}
          selected={state.selected}
        />
      )}
      {...props}
    >
      {children}
    </BaseCombobox.Item>
  );
};
ComboboxItem.displayName = "ComboboxItem";
