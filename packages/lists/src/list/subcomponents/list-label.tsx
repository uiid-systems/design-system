import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { ListLabelProps } from "../list.types";

import styles from "../list.module.css";

export const ListLabel = ({
  className,
  children,
  ...props
}: ListLabelProps) => {
  return (
    <Text
      data-slot="list-text-label"
      className={cx(styles["list-text-label"], className)}
      size={0}
      {...props}
    >
      {children}
    </Text>
  );
};
ListLabel.displayName = "ListLabel";
