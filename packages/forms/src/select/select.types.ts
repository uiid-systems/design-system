import type { Select as BaseSelect } from "@base-ui/react/select";
import type { CardContainerProps } from "@uiid/cards";
import type { Icon } from "@uiid/icons";
import type { PaletteColor } from "@uiid/tokens";
import type { WithLayoutProps } from "@uiid/utils";

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
  /**
   * Secondary line, stacked under the label. A node, matching the `ListItem`
   * underneath — the string it used to be narrowed to bought nothing.
   */
  description?: React.ReactNode;
  icon?: Icon;
  /**
   * Draws the row in place of the `icon` / `label` / `description` block, for
   * rows that need an element rather than two strings. `label` stays required
   * and keeps its other two jobs — it is what the trigger shows and what
   * typeahead matches — so a row can render anything without the closed select
   * losing its text. Mirrors Base UI, which splits the same three jobs across
   * `children`, `label`, and Root's `items`.
   */
  children?: React.ReactNode;
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
export type SelectBackdropProps = BaseSelect.Backdrop.Props;
export type SelectPositionerProps = BaseSelect.Positioner.Props;
/*
 * The popup takes the layout props `Card` spreads onto its container, not its
 * content slots (`title`, `footer`, ...): it is a surface for the list alone.
 */
export type SelectPopupProps = WithLayoutProps<
  BaseSelect.Popup.Props,
  CardContainerProps
> & {
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
  /**
   * Dims the page behind the open popup, the way a dialog or drawer does, so an
   * open menu is never lost against the content around it.
   *
   * Visual only: Base UI's Root is already `modal` by default, so page scroll
   * is locked and outside pointers are blocked whether or not this is drawn.
   * Pass `false` for a select that should sit quietly in a dense form.
   * @default true
   */
  backdrop?: boolean;
  RootProps?: SelectRootProps<Value, Multiple>;
  TriggerProps?: SelectTriggerProps;
  PortalProps?: SelectPortalProps;
  BackdropProps?: SelectBackdropProps;
  PositionerProps?: SelectPositionerProps;
  PopupProps?: SelectPopupProps;
  ListProps?: SelectListProps;
  ValueProps?: SelectValueProps;
  FieldProps?: FieldProps;
  IconProps?: SelectIconProps;
}> &
  SelectRootProps<Value, Multiple> &
  Pick<FieldProps, "label" | "description" | "action"> &
  InputVariants;
