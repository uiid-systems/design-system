"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";

import { cx } from "@uiid/utils";

import { Input } from "../../input/input";

import type { ComboboxInputProps } from "../combobox.types";
import styles from "../combobox.module.css";

export const ComboboxInput = ({
  label,
  description,
  name,
  placeholder,
  className,
  ...props
}: ComboboxInputProps) => {
  return (
    <BaseCombobox.Input
      data-slot="combobox-input"
      name={name}
      render={
        <Input name={name} label={label} description={description} fullwidth />
      }
      className={cx(styles["combobox-input"], className)}
      placeholder={placeholder}
      {...props}
    />
  );
};
ComboboxInput.displayName = "ComboboxInput";
