import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { BreadcrumbsListProps } from "../breadcrumbs.types";

import styles from "./breadcrumbs-list.module.css";

export const BreadcrumbsList = ({
  className,
  ...props
}: BreadcrumbsListProps) => {
  return (
    <Group
      render={<ol />}
      wrap
      gap={2}
      ay="center"
      data-slot="breadcrumbs-list"
      className={cx(styles["breadcrumbs-list"], className)}
      {...props}
    />
  );
};
BreadcrumbsList.displayName = "BreadcrumbsList";
