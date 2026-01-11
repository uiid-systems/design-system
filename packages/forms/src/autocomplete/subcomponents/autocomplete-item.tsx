"use client";

import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";

import { ListItem } from "@uiid/lists";

import type { AutocompleteItemProps } from "../autocomplete.types";
import styles from "../autocomplete.module.css";

export const AutocompleteItem = ({
  value,
  children,
  ...props
}: AutocompleteItemProps) => {
  return (
    <BaseAutocomplete.Item
      data-slot="autocomplete-item"
      value={value}
      className={styles["autocomplete-item"]}
      {...props}
      render={(renderProps) => (
        <ListItem
          render={<div />}
          fullwidth
          label={value as string}
          value={value}
          {...renderProps}
        />
      )}
    >
      {children}
    </BaseAutocomplete.Item>
  );
};
AutocompleteItem.displayName = "AutocompleteItem";
