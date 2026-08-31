"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import { inputVariants } from "../../input/input.variants";
import type { SelectValueProps } from "../select.types";

import styles from "../select.module.css";

/**
 * The trigger paints the control surface; the value only sits in it. It takes
 * the size tier so its metrics track the trigger's, but deliberately not
 * Input's `.input` class — wearing that made it paint a second surface inside
 * the first, which Input then had to carve back out with an exclusion selector.
 */
export const SelectValue = ({
  size,
  className,
  ...props
}: SelectValueProps) => {
  return (
    <BaseSelect.Value
      data-slot="select-value"
      render={<Text truncate pl={0} />}
      className={cx(styles["select-value"], inputVariants({ size }), className)}
      {...props}
    />
  );
};
SelectValue.displayName = "SelectValue";
