import { SwitchRender, Stack, Group } from "@uiid/layout";

import type { ListProps } from "./list.types";
import styles from "./list.module.css";
import { ListItem, ListItemGroup } from "./subcomponents";

/**
 * @name List
 * @description The List component is a versatile component that can be used to render a list of items or a list of item groups.
 * @param type - The type of list to render.
 * @param direction - The direction of the list.
 * @param items - The items to render in the list. Can be a list of items or a list of item groups.
 * @param children - The children to render in the list.
 * @param props - The props to pass to the list.
 * @returns A list component.
 */
export const List = ({
  type = "none",
  direction = "column",
  variant,
  items,
  children,
  LinkComponent,
  ...props
}: ListProps) => {
  const ListElement = type === "ordered" ? <ol /> : <ul />;

  const sharedProps = {
    className: styles["list"],
    "data-slot": "list",
    "data-type": type,
    "data-direction": direction,
    "data-variant": variant,
    ...props,
  };

  return (
    <SwitchRender
      condition={direction === "row"}
      p={0}
      m={0}
      {...sharedProps}
      render={{
        true: <Group render={ListElement} ay="start" gap={4} />,
        false: <Stack render={ListElement} ax="stretch" />,
      }}
    >
      {items
        ? items.map((item) =>
            "items" in item ? (
              <ListItemGroup
                key={item.category}
                LinkComponent={LinkComponent}
                {...item}
              />
            ) : (
              <ListItem
                key={item.value}
                fullwidth={direction === "column"}
                LinkComponent={LinkComponent}
                {...item}
              />
            ),
          )
        : children}
    </SwitchRender>
  );
};
List.displayName = "List";
