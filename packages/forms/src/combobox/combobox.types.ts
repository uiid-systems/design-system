import type { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import type { CardContainerProps } from "@uiid/cards";
import type { GroupProps } from "@uiid/layout";
import type { PaletteColor } from "@uiid/tokens";
import type { WithLayoutProps, WithStringClassName } from "@uiid/utils";

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
export type ComboboxInputProps = Omit<
  WithStringClassName<BaseCombobox.Input.Props>,
  "size"
> &
  Pick<
    InputProps,
    "FieldProps" | "before" | "after" | "size" | "variant" | "fullwidth"
  > &
  Pick<FieldProps, "label" | "description" | "action"> & {
    /**
     * Palette hue applied as a tinted bg/fg/border/hover surface treatment. The
     * input borrows Input's control surface, so it borrows Input's hue classes
     * too rather than declaring its own.
     */
    color?: ComboboxColor;
    /**
     * Props for the input group the part renders around its control row. The
     * group wraps the row alone, not the label, description or error, since
     * Base UI positions the popup against it.
     */
    InputGroupProps?: ComboboxInputGroupProps;
  };
export type ComboboxPortalProps = BaseCombobox.Portal.Props;
export type ComboboxPositionerProps =
  WithStringClassName<BaseCombobox.Positioner.Props>;
/* Card's container layout props only, as on `SelectPopupProps`. */
export type ComboboxPopupProps = WithLayoutProps<
  WithStringClassName<BaseCombobox.Popup.Props>,
  CardContainerProps
> & {
  /**
   * Palette hue for the popup surface, forwarded to the `Card` the popup
   * renders as. Left undefined, `Card` falls back to its own neutral default.
   */
  color?: ComboboxColor;
};
export type ComboboxListProps = BaseCombobox.List.Props;
/**
 * Base UI's Item props, with `value` typed by the combobox's `Value`, plus the
 * row's `label`. Base UI's item renders no text of its own; the label falls
 * back to a `label` on an object value, then to a primitive value itself.
 */
export type ComboboxItemProps<Value = string> = Omit<
  WithStringClassName<BaseCombobox.Item.Props>,
  "value"
> & {
  /** The value this item selects, typed by the combobox's `Value`. */
  value?: Value;
  /** The row's text, for a value that is not its own label. */
  label?: React.ReactNode;
};
export type ComboboxEmptyProps = WithStringClassName<BaseCombobox.Empty.Props>;
export type ComboboxInputGroupProps =
  WithStringClassName<BaseCombobox.InputGroup.Props> &
    Pick<InputProps, "size" | "fullwidth">;
export type ComboboxTriggerProps =
  WithStringClassName<BaseCombobox.Trigger.Props>;
export type ComboboxClearProps = WithStringClassName<BaseCombobox.Clear.Props>;
export type ComboboxIconProps = BaseCombobox.Icon.Props;
export type ComboboxStatusProps = BaseCombobox.Status.Props;
export type ComboboxGroupProps = BaseCombobox.Group.Props;
export type ComboboxGroupLabelProps = BaseCombobox.GroupLabel.Props;
export type ComboboxValueProps = BaseCombobox.Value.Props;
export type ComboboxChipsProps = WithLayoutProps<
  BaseCombobox.Chips.Props,
  GroupProps
>;
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
  /**
   * The items to filter and render, typed by the combobox's `Value` so it can
   * be inferred from them. Readonly, so an `as const` list works. An object
   * value takes `itemToStringLabel` for its text, as in Base UI, unless it has
   * a `label` of its own. Grouped items need the composed parts.
   */
  items?: readonly Value[];
}> &
  Omit<ComboboxRootProps<Value, Multiple>, "items"> &
  Pick<
    ComboboxInputProps,
    | "placeholder"
    | "onFocus"
    | "onBlur"
    | "before"
    | "after"
    | "size"
    | "variant"
    | "fullwidth"
  > &
  Pick<FieldProps, "label" | "description" | "action">;
