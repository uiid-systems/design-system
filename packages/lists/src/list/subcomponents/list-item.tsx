import { ConditionalRender, Group } from "@uiid/layout";

import { ICON_SIZE_LARGE } from "../list.constants";
import type { ListItemProps } from "../list.types";
import { ListRow } from "./list-row";
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
    <ListRow
      kind="item"
      render={render}
      ay="start"
      ax="space-between"
      gap={8}
      className={className}
      {...props}
    >
      {children || (
        <ConditionalRender
          condition={!!Icon}
          render={<Group gap={2} ay="start" w="full" />}
        >
          {Icon && (
            <Icon
              data-slot="list-item-icon"
              className={styles["list-item-icon"]}
              size={ICON_SIZE_LARGE}
            />
          )}
          <ListTextBlock
            data-slot="list-item-text"
            label={label}
            description={description}
          />
        </ConditionalRender>
      )}
    </ListRow>
  );
};
ListItem.displayName = "ListItem";
