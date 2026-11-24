import type { Icon } from "@uiid/icons";
import type { BoxProps, GroupProps, StackProps } from "@uiid/layout";
import type { TextProps } from "@uiid/typography";

export type ListMarker = "none" | "disc" | "decimal" | "square";

export type ListItemProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  icon?: Icon;
} & GroupProps;

export type ListItemOrGroup = ListItemProps | ListGroupProps;

/** A row's label: the `Text` a `ListItem` renders for `label`. */
export type ListLabelProps = TextProps;

/** A row's secondary line: the `Text` a `ListItem` renders for `description`. */
export type ListDescriptionProps = TextProps;

/** A group's heading row. Renders nothing without a `category`. */
export type ListGroupHeaderProps = {
  category?: string;
  icon?: Icon;
};

/** Props for a group's root `Stack`. Its heading and items come from the entry. */
export type ListGroupRootProps = Omit<StackProps, "children" | "render">;

export type ListGroupProps = {
  category?: string;
  icon?: Icon;
  items: ListItemOrGroup[];
  /** Defaults for every item in this group and its nested groups. An item's own props win. */
  ItemProps?: Partial<ListItemProps>;
  /** Props for this group's root and every nested group's root, e.g. `className` or `gap`. */
  GroupProps?: ListGroupRootProps;
};

export type ListProps = Omit<BoxProps, "direction"> & {
  marker?: ListMarker;
  category?: string;
  icon?: Icon;
  items?: ListItemOrGroup[];
  /** Defaults for every item, including items in nested groups. An item's own props win. */
  ItemProps?: Partial<ListItemProps>;
  /** Props for the root of every group, including nested ones, e.g. `className` or `gap`. */
  GroupProps?: ListGroupRootProps;
} & Pick<StackProps, "ax" | "ay">;
