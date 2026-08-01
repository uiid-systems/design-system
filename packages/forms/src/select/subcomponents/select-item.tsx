import { Select as BaseSelect } from "@base-ui/react/select";
import { CheckIcon } from "@uiid/icons";
import { ListItem } from "@uiid/lists";

import type { SelectItemProps } from "../select.types";

import styles from "../select.module.css";

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
    >
      <ListItem
        render={<div />}
        fullwidth
        label={label}
        description={description}
        icon={icon}
      />
      <BaseSelect.ItemIndicator
        data-slot="select-item-indicator"
        className={styles["select-item-indicator"]}
        render={<CheckIcon />}
      />
    </BaseSelect.Item>
  );
};
SelectItem.displayName = "SelectItem";
