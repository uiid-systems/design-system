import type { Icon } from "@uiid/icons";
import type { BoxProps, GroupProps } from "@uiid/layout";

export type BreadcrumbsItemData = {
  label: string;
  /** The crumb's href. Also its React key, so keep values unique. */
  value: string;
  icon?: Icon;
};

type LinkComponent =
  | React.ComponentType<{ href: string; children: React.ReactNode }>
  | "a";

export type BreadcrumbsProps = BoxProps & {
  items: BreadcrumbsItemData[];
  /** Custom link component (e.g. Next.js Link) */
  linkAs?: LinkComponent;
};

export type BreadcrumbsListProps = GroupProps;
