import type { Icon } from "@uiid/icons";
import type { BoxProps, GroupProps, StackProps } from "@uiid/layout";

export type ListDirection = "row" | "column";
export type ListSize = "small" | "medium" | "large";

/**
 * A link component type that accepts href and children props.
 * Compatible with Next.js Link, React Router Link, etc.
 */
export type LinkComponent = React.ComponentType<{
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}>;

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
  content?: React.ReactNode;
  action?: React.ReactNode;
  /** Custom link component (e.g., Next.js Link, React Router Link) */
  LinkComponent?: LinkComponent;
} & GroupProps;

/** A single item or a nested group (recursive). */
export type ListItemOrGroup = ListItemProps | ListItemGroupProps;

export type ListItemGroupProps = {
  /** Stable unique identifier used as React key when provided. */
  id?: string;
  category?: string;
  description?: string;
  collapsible?: boolean;
  icon?: Icon;
  items: ListItemOrGroup[];
  /** Custom link component passed to all child items */
  LinkComponent?: LinkComponent;
};

type BaseListProps = Omit<BoxProps, "ax" | "ay" | "direction"> & {
  type?: "ordered" | "unordered" | "none";
  size?: ListSize;
  line?: boolean;
  items?: ListItemOrGroup[];
  /** Custom link component passed to all items (e.g., Next.js Link, React Router Link) */
  LinkComponent?: LinkComponent;
};

export type HorizontalListProps = BaseListProps & {
  direction: "row";
} & Pick<GroupProps, "ax" | "ay">;

export type VerticalListProps = BaseListProps & {
  direction?: "column";
} & Pick<StackProps, "ax" | "ay">;

export type ListProps = HorizontalListProps | VerticalListProps;
