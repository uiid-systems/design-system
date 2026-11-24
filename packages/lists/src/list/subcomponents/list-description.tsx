import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { ListDescriptionProps } from "../list.types";

import styles from "../list.module.css";

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
