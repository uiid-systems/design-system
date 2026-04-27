import { cx } from "@uiid/utils";
import { ConditionalRender, Group, Stack } from "@uiid/layout";

import type { ListItemProps } from "../list.types";
import { ICON_SIZE_LARGE } from "../list.constants";
import styles from "../list.module.css";

import { ListTextBlock } from "./list-text-block";
import { ListSelectedIcon } from "./list-selected-icon";

export const ListItem = ({
  disabled,
  selected,
  render,
  className,
  icon: Icon,
  label,
  description,
  content,
  action,
  ...props
}: ListItemProps) => {
  return (
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
      <ConditionalRender
        condition={Boolean(!!Icon || selected)}
        render={
          <Group
            gap={3}
            ay="start"
            fullwidth
            style={{ listStyleType: "none" }}
          />
        }
      >
        {Icon && (
          <Icon
            data-slot="list-item-icon"
            size={ICON_SIZE_LARGE}
            style={{ color: "var(--shade-foreground)" }}
          />
        )}
        <ConditionalRender
          condition={!!content}
          render={<Stack fullwidth gap={1} />}
        >
          <ConditionalRender
            condition={!!selected || !!action}
            render={<Group fullwidth ay="center" gap={2} ax="space-between" />}
          >
            <ListTextBlock
              data-slot="list-item-text"
              label={label}
              description={description}
            />
            {selected && <ListSelectedIcon />}
            {action}
            {}
          </ConditionalRender>
          {content}
        </ConditionalRender>
      </ConditionalRender>
    </Group>
  );
};
ListItem.displayName = "ListItem";
