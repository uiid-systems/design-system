import type { Select as BaseSelect } from "@base-ui/react/select";
import type { Icon } from "@uiid/icons";
import type { PaletteColor } from "@uiid/tokens";

import type { FieldProps } from "../field/field.types";
import type { InputVariants } from "../input/input.types";
import type { FormItemProps } from "../types";

/** Shared type for single/multiple select mode. Used by Combobox. */
export type SelectMultipleMode = true | false | undefined;

/**
 * Palette hue for the colored surface treatment. One hue resolves the trigger's
 * background, foreground, border, and hover together, and tints the popup that
 * hangs off it.
 */
export type SelectColor = PaletteColor;

export type SelectItemProps = FormItemProps & {
  description?: string;
  icon?: Icon;
};

export type SelectRootProps<
  Value = string,
  Multiple extends SelectMultipleMode = false,
> = BaseSelect.Root.Props<Value, Multiple>;
export type SelectTriggerProps = BaseSelect.Trigger.Props &
  Pick<InputVariants, "variant" | "fullwidth" | "size"> & {
    before?: React.ReactNode;
    after?: React.ReactNode;
    /**
     * Palette hue applied as a tinted bg/fg/border/hover surface treatment. The
     * trigger borrows Input's control surface, so it borrows Input's hue
     * classes too rather than declaring its own.
     */
    color?: SelectColor;
  };
export type SelectPortalProps = BaseSelect.Portal.Props;
export type SelectPositionerProps = BaseSelect.Positioner.Props;
export type SelectPopupProps = BaseSelect.Popup.Props & {
  /**
   * Palette hue for the popup surface, forwarded to the `Card` the popup
   * renders as. Left undefined, `Card` falls back to its own neutral default.
   */
  color?: SelectColor;
};
export type SelectListProps = BaseSelect.List.Props;
export type SelectValueProps = BaseSelect.Value.Props &
  Pick<InputVariants, "size">;
export type SelectIconProps = BaseSelect.Icon.Props;

export type SelectProps<
  Value = string,
  Multiple extends SelectMultipleMode = false,
> = React.PropsWithChildren<{
  placeholder?: string;
  before?: React.ReactNode;
  after?: React.ReactNode;
  /**
   * Palette hue applied as a tinted surface treatment. Tints the trigger and
   * the popup together, since the popup is portalled out of the trigger's
   * subtree and cannot inherit the hue through the DOM.
   */
  color?: SelectColor;
  items?: SelectItemProps[];
  RootProps?: SelectRootProps<Value, Multiple>;
  TriggerProps?: SelectTriggerProps;
  PortalProps?: SelectPortalProps;
  PositionerProps?: SelectPositionerProps;
  PopupProps?: SelectPopupProps;
  ListProps?: SelectListProps;
  ValueProps?: SelectValueProps;
  FieldProps?: FieldProps;
  IconProps?: SelectIconProps;
}> &
  SelectRootProps<Value, Multiple> &
  Pick<FieldProps, "label" | "description"> &
  InputVariants;
