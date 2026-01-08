import { Combobox as BaseCombobox } from "@base-ui/react/combobox";

import { ListItem } from "@uiid/lists";

import type { ComboboxItemProps } from "../combobox.types";
import styles from "../combobox.module.css";

export const ComboboxItem = ({
  value,
  children,
  ...props
}: ComboboxItemProps) => {
  return (
    <BaseCombobox.Item
      data-slot="combobox-item"
      value={value}
      className={styles["combobox-item"]}
      {...props}
      render={(renderProps, state) => (
        <ListItem
          render={<div />}
          fullwidth
          label={value}
          value={value}
          data-selected={state.highlighted}
          selected={state.selected}
          {...renderProps}
        />
      )}
    >
      {children}
    </BaseCombobox.Item>
  );
};
ComboboxItem.displayName = "ComboboxItem";
