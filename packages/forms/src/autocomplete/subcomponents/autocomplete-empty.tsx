"use client";

import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";

import { cx } from "@uiid/utils";

import type { AutocompleteEmptyProps } from "../autocomplete.types";
import styles from "../autocomplete.module.css";

export const AutocompleteEmpty = ({
  className,
  children,
  ...props
}: AutocompleteEmptyProps) => {
  return (
    <BaseAutocomplete.Empty
      data-slot="autocomplete-empty"
      className={cx(styles["autocomplete-empty"], className)}
      {...props}
    >
      {children}
    </BaseAutocomplete.Empty>
  );
};
AutocompleteEmpty.displayName = "AutocompleteEmpty";
