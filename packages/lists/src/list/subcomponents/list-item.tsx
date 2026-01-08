import { cx } from "@uiid/utils";
import { ConditionalRender, Group } from "@uiid/layout";

import type { ListItemProps } from "../list.types";
import { ICON_SIZE_LARGE } from "../list.constants";

import styles from "./list-item.module.css";

import { ListTextBlock } from "./list-text-block";
import { ListSelectedIcon } from "./list-selected-icon";

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
        tabIndex={disabled ? -1 : 0}
        data-disabled={disabled ?? undefined}
        data-selected={selected}
        {...props}
      >
        <Group gap={3} ay="start" style={{ listStyleType: "none" }}>
          {Icon && (
            <Icon
              data-slot="list-item-icon"
              size={ICON_SIZE_LARGE}
              style={{ color: "var(--shade-foreground)" }}
            />
          )}
          <ListTextBlock
            data-slot="list-item-text"
            label={label}
            description={description}
          />
        </Group>
        {selected && !disabled && <ListSelectedIcon />}
      </Group>
    </ConditionalRender>
  );
};
ListItem.displayName = "ListItem";
