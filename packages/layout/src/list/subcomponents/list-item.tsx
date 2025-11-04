import { Group } from "../../group/group";

import type { ListItemProps } from "../list.types";
import { ICON_SIZE } from "../list.constants";

import styles from "./list-item.module.css";

import { ListTextBlock } from "./list-text-block";
import { ListSelectedIcon } from "./list-selected-icon";
import { ListDisabledIcon } from "./list-disabled-icon";

export const ListItem = ({
  disabled,
  selected,
  render,
  icon: Icon,
  label,
  description,
  ...props
}: ListItemProps) => {
  return (
    <Group
      render={render ?? <li />}
      ay="start"
      gap={2}
      className={styles["list-item"]}
      data-disabled={disabled}
      data-selected={selected}
      {...props}
    >
      {Icon && <Icon size={ICON_SIZE} />}
      <ListTextBlock label={label} description={description} />
      {selected && <ListSelectedIcon />}
      {disabled && <ListDisabledIcon />}
    </Group>
  );
};
ListItem.displayName = "ListItem";
