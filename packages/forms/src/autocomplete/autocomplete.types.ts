import type { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";
import type { PaletteColor } from "@uiid/tokens";

import type { FieldProps } from "../field/field.types";
import type { InputProps } from "../input/input.types";

/**
 * Palette hue for the colored surface treatment. One hue resolves the input's
 * background, foreground, border, and hover together, and tints the popup that
 * hangs off it.
 */
export type AutocompleteColor = PaletteColor;

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
  Pick<FieldProps, "label" | "description"> & {
    /**
     * Palette hue applied as a tinted bg/fg/border/hover surface treatment. The
     * input borrows Input's control surface, so it borrows Input's hue classes
     * too rather than declaring its own.
     */
    color?: AutocompleteColor;
  };
export type AutocompletePortalProps = BaseAutocomplete.Portal.Props;
export type AutocompletePositionerProps = BaseAutocomplete.Positioner.Props;
export type AutocompletePopupProps = BaseAutocomplete.Popup.Props & {
  /**
   * Palette hue for the popup surface, forwarded to the `Card` the popup
   * renders as. Left undefined, `Card` falls back to its own neutral default.
   */
  color?: AutocompleteColor;
};
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
  /**
   * Palette hue applied as a tinted surface treatment. Tints the input and the
   * popup together, since the popup is portalled out of the input's subtree and
   * cannot inherit the hue through the DOM.
   */
  color?: AutocompleteColor;
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
