import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";

import { cx } from "@uiid/utils";

import { Input } from "../../input/input";

import type { AutocompleteInputProps } from "../autocomplete.types";
import styles from "../autocomplete.module.css";

export const AutocompleteInput = ({
  label,
  description,
  name,
  onFocus,
  onBlur,
  placeholder,
  className,
  ...props
}: AutocompleteInputProps) => {
  return (
    <BaseAutocomplete.Input
      data-slot="autocomplete-input"
      name={name}
      render={
        <Input
          name={name}
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
