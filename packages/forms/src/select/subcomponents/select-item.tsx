import { Select as BaseSelect } from "@base-ui/react/select";

import { ListItem } from "@uiid/lists";

import styles from "../select.module.css";
import type { SelectItemProps } from "../select.types";

export const SelectItem = ({
  value,
  label,
  description,
  icon,
  ...props
}: SelectItemProps) => {
  return (
    <BaseSelect.Item
      data-slot="select-item"
      value={value}
      label={label}
      className={styles["select-item"]}
      {...props}
      render={(renderProps, state) => (
        <ListItem
          render={<div />}
          fullwidth
          value={value}
          label={label}
          description={description}
          icon={icon}
          selected={state.selected}
          {...renderProps}
        />
      )}
    />
  );
};
SelectItem.displayName = "SelectItem";
