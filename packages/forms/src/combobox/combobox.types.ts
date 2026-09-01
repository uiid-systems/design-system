import type { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import type { PaletteColor } from "@uiid/tokens";

import type { FieldProps } from "../field/field.types";
import type { InputProps } from "../input/input.types";
import type { SelectMultipleMode } from "../select/select.types";

/**
 * Palette hue for the colored surface treatment. One hue resolves the input's
 * background, foreground, border, and hover together, and tints the popup that
 * hangs off it.
 */
export type ComboboxColor = PaletteColor;

export type ComboboxRootProps<
  Value,
  Multiple extends SelectMultipleMode = false,
> = BaseCombobox.Root.Props<Value, Multiple>;

/**
 * `size` is omitted and re-added for the same reason it is on `Input`: Base UI's
 * input renders an `<input>`, whose native `size` is the character-width
 * attribute, while `size` here is the system-wide control scale. Intersecting
 * the two would resolve to `never`.
 */
export type ComboboxInputProps = Omit<BaseCombobox.Input.Props, "size"> &
  Pick<InputProps, "FieldProps" | "before" | "after" | "size"> &
  Pick<FieldProps, "label" | "description"> & {
    /**
     * Palette hue applied as a tinted bg/fg/border/hover surface treatment. The
     * input borrows Input's control surface, so it borrows Input's hue classes
     * too rather than declaring its own.
     */
    color?: ComboboxColor;
  };
export type ComboboxPortalProps = BaseCombobox.Portal.Props;
export type ComboboxPositionerProps = BaseCombobox.Positioner.Props;
export type ComboboxPopupProps = BaseCombobox.Popup.Props & {
  /**
   * Palette hue for the popup surface, forwarded to the `Card` the popup
   * renders as. Left undefined, `Card` falls back to its own neutral default.
   */
  color?: ComboboxColor;
};
export type ComboboxListProps = BaseCombobox.List.Props;
export type ComboboxItemProps = BaseCombobox.Item.Props;
export type ComboboxEmptyProps = BaseCombobox.Empty.Props;
export type ComboboxInputGroupProps = BaseCombobox.InputGroup.Props &
  Pick<InputProps, "size">;
export type ComboboxTriggerProps = BaseCombobox.Trigger.Props;
export type ComboboxClearProps = BaseCombobox.Clear.Props;
export type ComboboxIconProps = BaseCombobox.Icon.Props;
export type ComboboxStatusProps = BaseCombobox.Status.Props;
export type ComboboxGroupProps = BaseCombobox.Group.Props;
export type ComboboxGroupLabelProps = BaseCombobox.GroupLabel.Props;
export type ComboboxValueProps = BaseCombobox.Value.Props;
export type ComboboxChipsProps = BaseCombobox.Chips.Props;
export type ComboboxChipProps = BaseCombobox.Chip.Props;
export type ComboboxChipRemoveProps = BaseCombobox.ChipRemove.Props;

export type ComboboxProps<
  Value = string,
  Multiple extends SelectMultipleMode = false,
> = React.PropsWithChildren<{
  /**
   * Palette hue applied as a tinted surface treatment. Tints the input and the
   * popup together, since the popup is portalled out of the input's subtree and
   * cannot inherit the hue through the DOM.
   */
  color?: ComboboxColor;
  RootProps?: ComboboxRootProps<Value, Multiple>;
  InputProps?: ComboboxInputProps;
  InputGroupProps?: ComboboxInputGroupProps;
  PortalProps?: ComboboxPortalProps;
  PositionerProps?: ComboboxPositionerProps;
  PopupProps?: ComboboxPopupProps;
  ListProps?: ComboboxListProps;
}> &
  ComboboxRootProps<Value, Multiple> &
  Pick<
    ComboboxInputProps,
    "placeholder" | "onFocus" | "onBlur" | "before" | "after" | "size"
  > &
  Pick<FieldProps, "label" | "description">;
