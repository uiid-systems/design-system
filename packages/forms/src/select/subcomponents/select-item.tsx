import { Select as BaseSelect } from "@base-ui-components/react/select";

import { ListItem } from "@uiid/layout";

import styles from "../select.module.css";
import type { SelectItemProps } from "../select.types";

export const SelectItem = ({
  value,
  label,
  disabled,
  description = "lorem ipsum dolor sit amet",
  icon,
  ...props
}: SelectItemProps) => {
  return (
    <BaseSelect.Item
      value={value}
      disabled={disabled}
      className={styles["select-item"]}
      {...props}
      render={(props, state) => (
        <ListItem
          render={<div />}
          fullwidth
          value={value}
          label={label}
          description={description}
          icon={icon}
          selected={state.selected}
          {...props}
        />
      )}
    />
  );
};
SelectItem.displayName = "SelectItem";
