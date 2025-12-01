import type { Icon } from "@uiid/icons";
import type { BoxProps } from "@uiid/layout";

export type BreadcrumbsItem = {
  label: string;
  value: string;
  icon?: Icon;
};

export type BreadcrumbsProps = Omit<BoxProps, "render"> & {
  items: BreadcrumbsItem[];
};
