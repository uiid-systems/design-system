import { cx } from "@uiid/utils";

import styles from "./breadcrumbs-item.module.css";

export const BreadcrumbsItem = ({
  className,
  ...props
}: React.ComponentProps<"li">) => {
  return (
    <li
      data-slot="breadcrumbs-item"
      className={cx(styles["breadcrumbs-item"], className)}
      {...props}
    />
  );
};
BreadcrumbsItem.displayName = "BreadcrumbsItem";
