import { Autocomplete as BaseAutocomplete } from "@base-ui-components/react/autocomplete";

import { cx } from "@uiid/utils";

import { Input } from "../../input/input";

import type { AutocompleteInputProps } from "../autocomplete.types";
import styles from "../autocomplete.module.css";

export const AutocompleteInput = ({
  placeholder,
  className,
  ...props
}: AutocompleteInputProps) => {
  return (
    <BaseAutocomplete.Input
      data-slot="autocomplete-input"
      render={<Input />}
      className={cx(styles["autocomplete-input"], className)}
      placeholder={placeholder}
      {...props}
    />
  );
};
AutocompleteInput.displayName = "AutocompleteInput";
