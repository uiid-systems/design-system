import { ConditionalRender, Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { ICON_SIZE_LARGE } from "../list.constants";
import type { ListItemProps } from "../list.types";
import { ListTextBlock } from "./list-text-block";

import styles from "../list.module.css";

export const ListItem = ({
  render,
  className,
  icon: Icon,
  label,
  description,
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
          <ListTextBlock
            data-slot="list-item-text"
            label={label}
            description={description}
          />
        </ConditionalRender>
      )}
    </Group>
  );
};
ListItem.displayName = "ListItem";
