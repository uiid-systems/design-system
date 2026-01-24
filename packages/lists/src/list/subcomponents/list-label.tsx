import { cx } from "@uiid/utils";
import { Text, type TextProps } from "@uiid/typography";

import styles from "../list.module.css";

export type ListLabelProps = TextProps;

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
