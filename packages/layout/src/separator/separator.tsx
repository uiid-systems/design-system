import { Separator as BaseSeparator } from "@base-ui/react/separator";

import { cx } from "@uiid/utils";

import type { SeparatorProps } from "./separator.types";
import styles from "./separator.module.css";

export const Separator = ({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) => {
  return (
    <BaseSeparator
      data-slot="separator"
      className={cx(styles["separator"], className)}
      data-orientation={orientation}
      {...props}
    />
  );
};
Separator.displayName = "Separator";
