import { SwitchRender } from "../switch-render/switch-render";
import { Stack } from "../stack/stack";
import { Group } from "../group/group";

import type {
  ListProps,
  HorizontalListProps,
  VerticalListProps,
} from "./list.types";
import styles from "./list.module.css";

export const List = ({
  type = "none",
  direction = "column",
  children,
  ...props
}: ListProps) => {
  const ListElement = type === "ordered" ? <ol /> : <ul />;

  const sharedProps = {
    uiid: "list",
    render: ListElement,
    className: styles["list"],
    "data-type": type,
    ...props,
  } as const;

  return (
    <SwitchRender
      condition={direction === "row"}
      wrappers={{
        true: <Group ay="start" {...(sharedProps as HorizontalListProps)} />,
        false: <Stack ax="stretch" {...(sharedProps as VerticalListProps)} />,
      }}
    >
      {children}
    </SwitchRender>
  );
};
List.displayName = "List";
