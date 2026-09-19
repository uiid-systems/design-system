"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { CheckIcon } from "@uiid/icons/check";
import { ListItem } from "@uiid/lists";

import type { SelectItemProps } from "../select.types";

import styles from "../select.module.css";

export const SelectItem = ({
  value,
  label,
  description,
  icon,
  children,
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
      {/* `children` goes through `ListItem`'s own escape hatch rather than
          replacing it, so a custom row keeps the wrapper the popup lays out
          against and the indicator stays pinned to the end. */}
      <ListItem
        render={<div />}
        fullwidth
        label={label}
        description={description}
        icon={icon}
      >
        {children}
      </ListItem>
      <BaseSelect.ItemIndicator
        data-slot="select-item-indicator"
        className={styles["select-item-indicator"]}
        render={<CheckIcon />}
      />
    </BaseSelect.Item>
  );
};
SelectItem.displayName = "SelectItem";
