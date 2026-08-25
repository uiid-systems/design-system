"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { cx } from "@uiid/utils";

import type { ComboboxEmptyProps } from "../combobox.types";

import styles from "../combobox.module.css";

export const ComboboxEmpty = ({
  className,
  children,
  ...props
}: ComboboxEmptyProps) => {
  return (
    <BaseCombobox.Empty
      data-slot="combobox-empty"
      className={cx(styles["combobox-empty"], className)}
      {...props}
    >
      {children}
    </BaseCombobox.Empty>
  );
};
ComboboxEmpty.displayName = "ComboboxEmpty";
