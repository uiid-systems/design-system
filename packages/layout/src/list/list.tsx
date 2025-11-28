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
    "data-variant": variant,
    ...props,
  };

  return (
    <SwitchRender
      condition={direction === "row"}
      render={{
        true: (
          <Group
            ay="start"
            gap={4}
            p={0}
            m={0}
            {...(sharedProps as HorizontalListProps)}
          />
        ),
        false: (
          <Stack
            ax="stretch"
            p={0}
            m={0}
            {...(sharedProps as VerticalListProps)}
          />
        ),
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
