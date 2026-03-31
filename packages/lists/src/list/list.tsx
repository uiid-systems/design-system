import { SwitchRender, Stack, Group } from "@uiid/layout";

import type { ListProps } from "./list.types";
import { LIST_DEFAULT_SIZE } from "./list.constants";
import styles from "./list.module.css";
import { ListItem, ListItemGroup } from "./subcomponents";

export const List = ({
  type = "none",
  size = LIST_DEFAULT_SIZE,
  direction = "column",
  line,
  items,
  children,
  LinkComponent,
  ...props
}: ListProps) => {
  const ListElement = type === "ordered" ? <ol /> : <ul />;

  const sharedProps = {
    "data-slot": "list",
    "data-type": type,
    "data-size": size,
    "data-direction": direction,
    "data-line": line ? "true" : undefined,
    className: styles["list"],
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
        ? items.map((item, index) =>
            "items" in item ? (
              <ListItemGroup
                data-line
                key={item.id ?? `${item.category ?? "group"}-${index}`}
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
