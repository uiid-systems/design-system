import { Combobox as BaseCombobox } from "@base-ui-components/react/combobox";

import { cx } from "@uiid/utils";

import { Input } from "../../input/input";

import type { ComboboxInputProps } from "../combobox.types";
import styles from "../combobox.module.css";

export const ComboboxInput = ({
  placeholder,
  className,
  ...props
}: ComboboxInputProps) => {
  return (
    <BaseCombobox.Input
      data-slot="combobox-input"
      render={<Input />}
      className={cx(styles["combobox-input"], className)}
      placeholder={placeholder}
      {...props}
    />
  );
};
ComboboxInput.displayName = "ComboboxInput";
