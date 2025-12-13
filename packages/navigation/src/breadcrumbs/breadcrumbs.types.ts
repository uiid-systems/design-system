import type { Icon } from "@uiid/icons";
import type { BoxProps } from "@uiid/layout";

export type BreadcrumbsItem = {
  label: string;
  value: string;
  icon?: Icon;
};

type LinkComponent =
  | React.ComponentType<{ href: string; children: React.ReactNode }>
  | "a";

export type BreadcrumbsProps = BoxProps & {
  items: BreadcrumbsItem[];
  /** Custom link component (e.g. Next.js Link) */
  linkAs?: LinkComponent;
};
