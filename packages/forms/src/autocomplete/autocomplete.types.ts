import type { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";
import type { CardContainerProps } from "@uiid/cards";
import type { PaletteColor } from "@uiid/tokens";
import type { WithLayoutProps } from "@uiid/utils";

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
  Pick<FieldProps, "label" | "description" | "action"> & {
    /**
     * Palette hue applied as a tinted bg/fg/border/hover surface treatment. The
     * input borrows Input's control surface, so it borrows Input's hue classes
     * too rather than declaring its own.
     */
    color?: AutocompleteColor;
    /**
     * Props for the input group the part renders around its control row. The
     * group wraps the row alone, not the label, description or error, since
     * Base UI positions the popup against it.
     */
    InputGroupProps?: AutocompleteInputGroupProps;
  };
export type AutocompletePortalProps = BaseAutocomplete.Portal.Props;
export type AutocompletePositionerProps = BaseAutocomplete.Positioner.Props;
/* Card's container layout props only, as on `SelectPopupProps`. */
export type AutocompletePopupProps = WithLayoutProps<
  BaseAutocomplete.Popup.Props,
  CardContainerProps
> & {
  /**
   * Palette hue for the popup surface, forwarded to the `Card` the popup
   * renders as. Left undefined, `Card` falls back to its own neutral default.
   */
  color?: AutocompleteColor;
};
export type AutocompleteListProps = BaseAutocomplete.List.Props;
/**
 * Base UI's Item props, with `value` typed by the autocomplete's `Value`, plus
 * the row's `label`. Base UI's item renders no text of its own; the label falls
 * back to a `label` on an object value, then to a primitive value itself.
 */
export type AutocompleteItemProps<Value = string> = Omit<
  BaseAutocomplete.Item.Props,
  "value"
> & {
  /** The item's value, typed by the autocomplete's `Value`. */
  value?: Value;
  /** The row's text, for a value that is not its own label. */
  label?: React.ReactNode;
};
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
  /**
   * The items to filter and render, typed by the autocomplete's `Value` so it
   * can be inferred from them. Readonly, so an `as const` list works. An object
   * value takes `itemToStringValue` for its text, as in Base UI, unless it has
   * a `label` of its own. Grouped items need the composed parts.
   */
  items?: readonly Value[];
} & Omit<AutocompleteRootProps<Value>, "items"> &
  Pick<
    AutocompleteInputProps,
    "placeholder" | "onFocus" | "onBlur" | "before" | "after" | "size"
  > &
  Pick<FieldProps, "label" | "description" | "action">;
