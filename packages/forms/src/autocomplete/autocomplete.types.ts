import type { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";

import type { FieldProps } from "../field/field.types";
import type { InputProps } from "../input/input.types";

export type AutocompleteRootProps<Value = string> =
  BaseAutocomplete.Root.Props<Value>;
/**
 * `size` is omitted and re-added for the same reason it is on `Input`: Base UI's
 * input renders an `<input>`, whose native `size` is the character-width
 * attribute, while `size` here is the system-wide control scale. Intersecting
 * the two would resolve to `never`.
 */
export type AutocompleteInputProps = Omit<
  BaseAutocomplete.Input.Props,
  "size"
> &
  Pick<InputProps, "FieldProps" | "before" | "after" | "size"> &
  Pick<FieldProps, "label" | "description">;
export type AutocompletePortalProps = BaseAutocomplete.Portal.Props;
export type AutocompletePositionerProps = BaseAutocomplete.Positioner.Props;
export type AutocompletePopupProps = BaseAutocomplete.Popup.Props;
export type AutocompleteListProps = BaseAutocomplete.List.Props;
export type AutocompleteItemProps = BaseAutocomplete.Item.Props;
export type AutocompleteEmptyProps = BaseAutocomplete.Empty.Props;
export type AutocompleteInputGroupProps = BaseAutocomplete.InputGroup.Props &
  Pick<InputProps, "size">;
export type AutocompleteTriggerProps = BaseAutocomplete.Trigger.Props;
export type AutocompleteClearProps = BaseAutocomplete.Clear.Props;
export type AutocompleteIconProps = BaseAutocomplete.Icon.Props;
export type AutocompleteStatusProps = BaseAutocomplete.Status.Props;
export type AutocompleteGroupProps = BaseAutocomplete.Group.Props;
export type AutocompleteGroupLabelProps = BaseAutocomplete.GroupLabel.Props;
export type AutocompleteValueProps = BaseAutocomplete.Value.Props;

export type AutocompleteProps<Value = string> = {
  RootProps?: AutocompleteRootProps<Value>;
  InputProps?: AutocompleteInputProps;
  InputGroupProps?: AutocompleteInputGroupProps;
  PortalProps?: AutocompletePortalProps;
  PositionerProps?: AutocompletePositionerProps;
  PopupProps?: AutocompletePopupProps;
  ListProps?: AutocompleteListProps;
} & AutocompleteRootProps<Value> &
  Pick<
    AutocompleteInputProps,
    "placeholder" | "onFocus" | "onBlur" | "before" | "after" | "size"
  > &
  Pick<FieldProps, "label" | "description">;
