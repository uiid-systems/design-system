import type { Autocomplete } from "@base-ui-components/react/autocomplete";

import type { InputProps } from "../input/input.types";

export type AutocompleteDefaultItem = {
  value: string;
  label: string;
};

export type AutocompleteProps<T = AutocompleteDefaultItem> = {
  items: T[];
  /**
   * Props for the root element of the autocomplete.
   * @see https://base-ui.com/react/components/autocomplete#root
   */
  RootProps?: Omit<Autocomplete.Root.Props<T>, "items">;
  InputProps?: InputProps;
  ValueProps?: Autocomplete.Value.Props;
  PortalProps?: Autocomplete.Portal.Props;
  PositionerProps?: Autocomplete.Positioner.Props;
  PopupProps?: Autocomplete.Popup.Props;
} & Pick<
  InputProps,
  "label" | "description" | "hint" | "required" | "onChange"
>;
