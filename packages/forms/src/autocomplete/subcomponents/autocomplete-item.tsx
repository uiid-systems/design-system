import { Autocomplete as BaseAutocomplete } from "@base-ui-components/react/autocomplete";

import { ListItem } from "@uiid/layout";

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
      render={() => (
        <ListItem render={<div />} fullwidth label={value} value={value} />
      )}
    >
      {children}
    </BaseAutocomplete.Item>
  );
};
AutocompleteItem.displayName = "AutocompleteItem";
