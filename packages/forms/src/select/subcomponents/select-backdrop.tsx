"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { cx } from "@uiid/utils";

import type { SelectBackdropProps } from "../select.types";

import styles from "../select.module.css";

export const SelectBackdrop = ({
  className,
  ...props
}: SelectBackdropProps) => {
  return (
    <BaseSelect.Backdrop
      data-slot="select-backdrop"
      className={cx(styles["select-backdrop"], className)}
      {...props}
    />
  );
};
SelectBackdrop.displayName = "SelectBackdrop";
