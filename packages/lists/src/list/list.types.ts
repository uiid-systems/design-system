import type { Icon } from "@uiid/icons";
import type { BoxProps, GroupProps, StackProps } from "@uiid/layout";

export type ListDirection = "row" | "column";

export type ListItemProps = {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
  selected?: boolean;
  icon?: Icon;
  href?: string;
  target?: string;
  rel?: string;
} & GroupProps;

export type ListItemGroupProps = {
  category?: string;
  collapsible?: boolean;
  icon?: Icon;
  items: ListItemProps[];
};

type BaseListProps = Omit<BoxProps, "ax" | "ay" | "direction"> & {
  type?: "ordered" | "unordered" | "none";
  variant?: "line";
  items?: (ListItemProps | ListItemGroupProps)[];
};

export type HorizontalListProps = BaseListProps & {
  direction: "row";
} & Pick<GroupProps, "ax" | "ay">;

export type VerticalListProps = BaseListProps & {
  direction?: "column";
} & Pick<StackProps, "ax" | "ay">;

export type ListProps = HorizontalListProps | VerticalListProps;
