import { Text, type TextProps } from "@uiid/typography";
import { cx } from "@uiid/utils";

import styles from "../list.module.css";

export type ListDescriptionProps = TextProps;

export const ListDescription = ({
  className,
  children,
  ...props
}: ListDescriptionProps) => {
  return (
    <Text
      data-slot="list-text-description"
      className={cx(styles["list-text-description"], className)}
      size={0}
      {...props}
    >
      {children}
    </Text>
  );
};
ListDescription.displayName = "ListDescription";
