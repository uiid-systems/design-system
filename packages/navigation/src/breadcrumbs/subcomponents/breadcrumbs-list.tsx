import { cx } from "@uiid/utils";

import styles from "./breadcrumbs-list.module.css";

export const BreadcrumbsList = ({
  className,
  ...props
}: React.ComponentProps<"ol">) => {
  return (
    <ol
      data-slot="breadcrumbs-list"
      className={cx(styles["breadcrumbs-list"], className)}
      {...props}
    />
  );
};
BreadcrumbsList.displayName = "BreadcrumbsList";
