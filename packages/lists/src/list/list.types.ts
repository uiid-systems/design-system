import type { Icon } from "@uiid/icons";
import type { BoxProps, GroupProps, StackProps } from "@uiid/layout";

export type ListDirection = "row" | "column";
export type ListSize = "small" | "medium" | "large";

export type ListItemProps = {
  value?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
  icon?: Icon;
  content?: React.ReactNode;
  action?: React.ReactNode;
} & Omit<GroupProps, "content">;

/** A single item or a nested group (recursive). */
export type ListItemOrGroup = ListItemProps | ListItemGroupProps;

export type ListItemGroupProps = {
  id?: string;
  category?: string;
  description?: string;
  collapsible?: boolean;
  icon?: Icon;
  items: ListItemOrGroup[];
};

type BaseListProps = Omit<BoxProps, "ax" | "ay" | "direction"> & {
  type?: "ordered" | "unordered" | "none";
  size?: ListSize;
  line?: boolean;
  items?: ListItemOrGroup[];
};

export type HorizontalListProps = BaseListProps & {
  direction: "row";
} & Pick<GroupProps, "ax" | "ay">;

export type VerticalListProps = BaseListProps & {
  direction?: "column";
} & Pick<StackProps, "ax" | "ay">;

export type ListProps = (HorizontalListProps | VerticalListProps) & {
  ItemProps?: ListItemProps;
};
