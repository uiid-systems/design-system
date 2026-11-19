"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { Box } from "@uiid/layout";
import { cxState } from "@uiid/utils";

import type { SelectSeparatorProps } from "../select.types";

import styles from "../select.module.css";

/**
 * A line between groups of rows, painted like the layout `Separator` but not
 * rendered as one. That component always goes through Base UI's `Separator`,
 * which adds `aria-orientation`, and that attribute is not allowed beside the
 * `role="presentation"` a listbox separator carries.
 */
export const SelectSeparator = ({
  className,
  ...props
}: SelectSeparatorProps) => {
  return (
    <BaseSelect.Separator
      data-slot="select-separator"
      render={<Box my={1} />}
      className={cxState(styles["select-separator"], className)}
      {...props}
    />
  );
};
SelectSeparator.displayName = "SelectSeparator";
