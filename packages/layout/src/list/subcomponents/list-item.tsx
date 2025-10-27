import { Text } from "@uiid/typography";
import { Check, Ban } from "@uiid/icons";

import { Group } from "../../group/group";

import type { ListItemProps } from "../list.types";
import styles from "./list-item.module.css";

const ICON_SIZE = 12;

export const ListItem = ({
  disabled,
  selected,
  render,
  icon: Icon,
  children,
  ...props
}: ListItemProps) => {
  return (
    <Group
      render={render ?? <li />}
      ay="center"
      fullwidth
      gap={2}
      className={styles["list-item"]}
      data-disabled={disabled}
      data-selected={selected}
      {...props}
    >
      {Icon && <Icon size={ICON_SIZE} />}
      <Text level={0}>{children}</Text>
      {selected && (
        <Check
          size={ICON_SIZE}
          strokeWidth={4}
          stroke="var(--colors-success-bg)"
          style={{ marginInlineStart: "auto" }}
        />
      )}
      {disabled && (
        <Ban
          size={ICON_SIZE}
          strokeWidth={4}
          stroke="var(--colors-error-bg)"
          style={{ marginInlineStart: "auto" }}
        />
      )}
    </Group>
  );
};
ListItem.displayName = "ListItem";
