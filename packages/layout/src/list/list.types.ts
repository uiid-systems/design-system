import type { Icon } from "@uiid/icons";

import type { GroupProps } from "../group/group.types";
import type { StackProps } from "../stack/stack.types";

export type ListItemProps = {
  disabled?: boolean;
  selected?: boolean;
  icon?: Icon;
} & GroupProps;

export type HorizontalListProps = {
  direction?: "row";
  ax?: GroupProps["ax"];
  ay?: GroupProps["ay"];
} & Omit<GroupProps, "ax" | "ay">;

export type VerticalListProps = {
  direction?: "column";
  ax?: StackProps["ax"];
  ay?: StackProps["ay"];
} & Omit<StackProps, "ax" | "ay">;

export type ListProps = {
  type?: "ordered" | "unordered" | "none";
} & (HorizontalListProps | VerticalListProps);
