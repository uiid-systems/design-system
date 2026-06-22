import { cx } from "@uiid/utils";
import { ConditionalRender, Group } from "@uiid/layout";

import type { ListItemProps } from "../list.types";
import { ICON_SIZE_LARGE } from "../list.constants";
import styles from "../list.module.css";

import { ListTextBlock } from "./list-text-block";

export const ListItem = ({
  render,
  className,
  icon: Icon,
  label,
  description,
  action,
  children,
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
      {...props}
    >
      {children || (
        <ConditionalRender
          condition={!!Icon}
          render={
            <Group
              gap={2}
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
            condition={!!action}
            render={<Group fullwidth ay="center" gap={2} ax="space-between" />}
          >
            <ListTextBlock
              data-slot="list-item-text"
              label={label}
              description={description}
            />
            {action}
          </ConditionalRender>
        </ConditionalRender>
      )}
    </Group>
  );
};
ListItem.displayName = "ListItem";
