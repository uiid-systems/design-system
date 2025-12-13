import { cx } from "@uiid/utils";

import { ConditionalRender } from "../../conditional-render/conditional-render";
import { Group } from "../../group/group";

import type { ListItemProps } from "../list.types";
import { ICON_SIZE_SMALL } from "../list.constants";

import styles from "./list-item.module.css";

import { ListTextBlock } from "./list-text-block";
import { ListSelectedIcon } from "./list-selected-icon";
import { ListDisabledIcon } from "./list-disabled-icon";

export const ListItem = ({
  disabled,
  selected,
  render,
  className,
  href,
  target,
  rel,
  icon: Icon,
  label,
  description,
  ...props
}: ListItemProps) => {
  return (
    <ConditionalRender
      condition={!!href}
      render={
        render ?? (
          <a
            href={href}
            target={target}
            rel={rel}
            style={{ display: "contents" }}
          />
        )
      }
    >
      <Group
        data-slot="list-item"
        render={render ?? <li />}
        ay="start"
        ax="space-between"
        gap={8}
        className={cx(styles["list-item"], className)}
        data-disabled={disabled}
        data-selected={selected}
        {...props}
      >
        <Group gap={2}>
          {Icon && <Icon data-slot="list-item-icon" size={ICON_SIZE_SMALL} />}
          <ListTextBlock
            data-slot="list-item-text"
            label={label}
            description={description}
          />
        </Group>
        {selected && <ListSelectedIcon />}
        {disabled && <ListDisabledIcon />}
      </Group>
    </ConditionalRender>
  );
};
ListItem.displayName = "ListItem";
