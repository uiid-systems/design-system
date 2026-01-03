import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";

import { cx } from "@uiid/utils";

import { Input } from "../../input/input";

import type { AutocompleteInputProps } from "../autocomplete.types";
import styles from "../autocomplete.module.css";

export const AutocompleteInput = ({
  label,
  description,
  onFocus,
  onBlur,
  placeholder,
  className,
  ...props
}: AutocompleteInputProps) => {
  return (
    <BaseAutocomplete.Input
      data-slot="autocomplete-input"
      render={
        <Input
          label={label}
          description={description}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      }
      className={cx(styles["autocomplete-input"], className)}
      placeholder={placeholder}
      {...props}
    />
  );
};
AutocompleteInput.displayName = "AutocompleteInput";
