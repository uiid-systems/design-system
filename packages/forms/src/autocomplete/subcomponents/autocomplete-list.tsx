"use client";

import { Autocomplete as BaseAutocomplete } from "@base-ui-components/react/autocomplete";

import { cx } from "@uiid/utils";

import type { AutocompleteListProps } from "../autocomplete.types";
import styles from "../autocomplete.module.css";

export const AutocompleteList = ({
  className,
  children,
  ...props
}: AutocompleteListProps) => {
  return (
    <BaseAutocomplete.List
      data-slot="autocomplete-list"
      className={cx(styles["autocomplete-list"], className)}
      {...props}
    >
      {children}
    </BaseAutocomplete.List>
  );
};
AutocompleteList.displayName = "AutocompleteList";
