"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { ChevronsUpDownIcon } from "@uiid/icons/chevrons-up-down";
import { cxState } from "@uiid/utils";

import type { SelectIconProps } from "../select.types";

import styles from "../select.module.css";

export const SelectIcon = ({ className, ...props }: SelectIconProps) => {
  return (
    <BaseSelect.Icon
      data-slot="select-icon"
      render={<ChevronsUpDownIcon />}
      className={cxState(styles["select-icon"], className)}
      {...props}
    />
  );
};
SelectIcon.displayName = "SelectIcon";
