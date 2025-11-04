import { SwitchRender } from "../switch-render/switch-render";
import { Stack } from "../stack/stack";
import { Group } from "../group/group";

import type {
  ListProps,
  HorizontalListProps,
  VerticalListProps,
} from "./list.types";
import styles from "./list.module.css";
import { ListItem, ListItemGroup } from "./subcomponents";

export const List = ({
  type = "none",
  direction = "column",
  items,
  children,
  ...props
}: ListProps) => {
  const ListElement = type === "ordered" ? <ol /> : <ul />;

  const sharedProps = {
    toretto: "list",
    direction,
    items,
    render: ListElement,
    className: styles["list"],
    "data-type": type,
    "data-direction": direction,
    ...props,
  };

  return (
    <SwitchRender
      condition={direction === "row"}
      render={{
        true: (
          <Group ay="start" gap={4} {...(sharedProps as HorizontalListProps)} />
        ),
        false: <Stack ax="stretch" {...(sharedProps as VerticalListProps)} />,
      }}
    >
      {items
        ? items.map((item) =>
            "items" in item ? (
              <ListItemGroup key={item.category} {...item} />
            ) : (
              <ListItem
                key={item.value}
                fullwidth={direction === "column"}
                {...item}
              />
            ),
          )
        : children}
    </SwitchRender>
  );
};
List.displayName = "List";
