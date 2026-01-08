"use client";

import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";
import { List } from "@uiid/lists";

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
      render={<List fullwidth />}
      className={cx(styles["autocomplete-list"], className)}
      {...props}
    >
      {children}
    </BaseAutocomplete.List>
  );
};
AutocompleteList.displayName = "AutocompleteList";
