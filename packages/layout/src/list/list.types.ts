import type { Icon } from "@uiid/icons";

import type { BoxProps } from "../box/box.types";

import type { GroupProps } from "../group/group.types";
import type { StackProps } from "../stack/stack.types";

export type ListDirection = "row" | "column";

export type ListItemProps = {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
  selected?: boolean;
  icon?: Icon;
} & Pick<GroupProps, "render" | "fullwidth">;

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
