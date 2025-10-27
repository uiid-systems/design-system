import type { Autocomplete } from "@base-ui-components/react/autocomplete";

import type { InputProps } from "../input/input.types";

export type AutocompleteDefaultItem = {
  value: string;
  label: string;
};

export type AutocompleteProps<T = AutocompleteDefaultItem> = {
  /**
   * Items to display in the autocomplete.
   * @see https://base-ui.com/react/components/autocomplete#AutocompleteRoot-items
   */
  items: T[];
  /**
   * Callback fired when a value is selected.
   * Receives the selected item value and the item object.
   * @see https://base-ui.com/react/components/autocomplete#AutocompleteRoot-onValueChange
   */
  onValueChange?: (value: string | null, item: T | null) => void;
  /**
   * Props for the root element of the autocomplete.
   * @see https://base-ui.com/react/components/autocomplete#root
   */
  RootProps?: Omit<Autocomplete.Root.Props<T>, "items" | "onValueChange">;
  /**
   * Props for the input element of the autocomplete.
   * @see InputProps
   */
  InputProps?: InputProps;
} & Omit<InputProps, "onValueChange">;
