import { Combobox as BaseCombobox } from "@base-ui/react/combobox";

import { cx } from "@uiid/utils";

import { Input } from "../../input/input";

import type { ComboboxInputProps } from "../combobox.types";
import styles from "../combobox.module.css";

export const ComboboxInput = ({
  label,
  description,
  error,
  placeholder,
  className,
  ...props
}: ComboboxInputProps) => {
  return (
    <BaseCombobox.Input
      data-slot="combobox-input"
      render={<Input label={label} description={description} error={error} />}
      className={cx(styles["combobox-input"], className)}
      placeholder={placeholder}
      {...props}
    />
  );
};
ComboboxInput.displayName = "ComboboxInput";
