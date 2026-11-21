import type {
  ButtonProps,
  CollapsibleRootProps,
  ListItemProps,
  ListProps,
  StackProps,
} from "@uiid/design-system";

import type { ShellBarProps } from "@/components/shell";

export type SidebarRootProps = StackProps;
export type SidebarHeaderProps = ShellBarProps;
export type SidebarNavProps = StackProps;
export type SidebarItemsProps = ListProps;
export type SidebarToggleProps = ButtonProps;

export type SidebarItemProps = Omit<ListItemProps, "label"> & {
  href: string;
  /** The link points at the current page. */
  active?: boolean;
};

export type SidebarGroupProps = CollapsibleRootProps & {
  /** Names the group in saved state. Unique within the sidebar. */
  id: string;
  label: string;
  /** The group holds the current page. */
  active?: boolean;
};

export type SidebarProps = Omit<SidebarRootProps, "title"> & {
  /** Shown in the bar at the top of the sidebar. */
  title: React.ReactNode;
};

/** Which groups the reader has opened or closed, by group id. */
export type SidebarGroups = Record<string, boolean>;
