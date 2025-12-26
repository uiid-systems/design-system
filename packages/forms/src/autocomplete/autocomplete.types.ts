import type { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";

import type { FieldProps } from "../field/field.types";

export type AutocompleteRootProps<Value = string> =
  BaseAutocomplete.Root.Props<Value>;
export type AutocompleteInputProps = BaseAutocomplete.Input.Props &
  Pick<FieldProps, "label" | "description" | "error">;
export type AutocompletePortalProps = BaseAutocomplete.Portal.Props;
export type AutocompletePositionerProps = BaseAutocomplete.Positioner.Props;
export type AutocompletePopupProps = BaseAutocomplete.Popup.Props;
export type AutocompleteListProps = BaseAutocomplete.List.Props;
export type AutocompleteItemProps = BaseAutocomplete.Item.Props;
export type AutocompleteEmptyProps = BaseAutocomplete.Empty.Props;

export type AutocompleteProps<Value = string> = React.PropsWithChildren<{
  placeholder?: string;
  RootProps?: AutocompleteRootProps<Value>;
  InputProps?: AutocompleteInputProps;
  PortalProps?: AutocompletePortalProps;
  PositionerProps?: AutocompletePositionerProps;
  PopupProps?: AutocompletePopupProps;
  ListProps?: AutocompleteListProps;
}> &
  Pick<
    AutocompleteRootProps<Value>,
    "items" | "defaultValue" | "onValueChange"
  > &
  Pick<FieldProps, "label" | "description" | "error">;
