import { cx } from "@uiid/utils";

import type { BreadcrumbsItemProps } from "../breadcrumbs.types";

import styles from "./breadcrumbs-item.module.css";

export const BreadcrumbsItem = ({
  className,
  ...props
}: BreadcrumbsItemProps) => {
  return (
    <li
      data-slot="breadcrumbs-item"
      className={cx(styles["breadcrumbs-item"], className)}
      {...props}
    />
  );
};
BreadcrumbsItem.displayName = "BreadcrumbsItem";
