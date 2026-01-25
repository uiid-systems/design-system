import { Select as BaseSelect } from "@base-ui/react/select";

import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { SelectValueProps } from "../select.types";
import styles from "../select.module.css";

export const SelectValue = ({ className, ...props }: SelectValueProps) => {
  return (
    <BaseSelect.Value
      data-slot="select-value"
      render={<Text />}
      className={cx(styles["select-value"], className)}
      {...props}
    />
  );
};
SelectValue.displayName = "SelectValue";
