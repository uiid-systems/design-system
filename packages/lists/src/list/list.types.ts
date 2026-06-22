import type { Collapsible } from "@base-ui/react";

import type { Icon } from "@uiid/icons";
import type { BoxProps, GroupProps, StackProps } from "@uiid/layout";

export type ListMarker = "none" | "disc" | "decimal" | "square";

export type ListItemProps = {
  value?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
  icon?: Icon;
  action?: React.ReactNode;
} & GroupProps;

export type ListItemOrGroup = ListItemProps | ListGroupProps;

export type ListGroupProps = {
  id?: string;
  category?: string;
  collapsible?: boolean;
  icon?: Icon;
  items: ListItemOrGroup[];
} & Pick<Collapsible.Root.Props, "open" | "defaultOpen" | "onOpenChange">;

export type ListProps = Omit<BoxProps, "direction"> & {
  marker?: ListMarker;
  line?: boolean;
  items?: ListItemOrGroup[];
  ItemProps?: Partial<ListItemProps>;
  GroupProps?: Partial<ListGroupProps>;
} & Pick<StackProps, "ax" | "ay">;
