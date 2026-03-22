import { Select as BaseSelect } from "@base-ui/react/select";

import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import { inputVariants } from "../../input/input.variants";
import inputStyles from "../../input/input.module.css";

import type { SelectValueProps } from "../select.types";
import styles from "../select.module.css";

export const SelectValue = ({
  size,
  className,
  ...props
}: SelectValueProps) => {
  return (
    <BaseSelect.Value
      data-slot="select-value"
      render={<Text pl={0} />}
      className={cx(
        styles["select-value"],
        inputStyles["input"],
        inputVariants({ size }),
        className,
      )}
      {...props}
    />
  );
};
SelectValue.displayName = "SelectValue";
