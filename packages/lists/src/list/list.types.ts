import type { Icon } from "@uiid/icons";
import type { BoxProps, GroupProps, StackProps } from "@uiid/layout";

export type ListMarker = "none" | "disc" | "decimal" | "square";

export type ListItemProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  icon?: Icon;
} & GroupProps;

export type ListItemOrGroup = ListItemProps | ListGroupProps;

export type ListGroupProps = {
  category?: string;
  icon?: Icon;
  items: ListItemOrGroup[];
};

export type ListProps = Omit<BoxProps, "direction"> & {
  marker?: ListMarker;
  line?: boolean;
  items?: ListItemOrGroup[];
  ItemProps?: Partial<ListItemProps>;
  GroupProps?: Partial<ListGroupProps>;
} & Pick<StackProps, "ax" | "ay">;
