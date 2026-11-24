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

export type BreadcrumbsContainerProps = Omit<BreadcrumbsProps, "items">;

/** Group layout props, plus the `<ol>` attributes the list renders. */
export type BreadcrumbsListProps = GroupProps &
  Pick<React.OlHTMLAttributes<HTMLOListElement>, "start" | "reversed" | "type">;

export type BreadcrumbsItemProps = React.ComponentProps<"li">;

/** An `<li>` hidden from assistive tech. Renders `/` unless given children. */
export type BreadcrumbsSeparatorProps = React.ComponentProps<"li">;
