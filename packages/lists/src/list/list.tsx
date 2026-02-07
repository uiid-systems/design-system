import { SwitchRender, Stack, Group } from "@uiid/layout";

import type { ListProps } from "./list.types";
import styles from "./list.module.css";
import { ListItem, ListItemGroup } from "./subcomponents";

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
