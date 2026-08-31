import type { Select as BaseSelect } from "@base-ui/react/select";
import type { Icon } from "@uiid/icons";

import type { FieldProps } from "../field/field.types";
import type { InputVariants } from "../input/input.types";
import type { FormItemProps } from "../types";

/** Shared type for single/multiple select mode. Used by Combobox. */
export type SelectMultipleMode = true | false | undefined;

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
  };
export type SelectPortalProps = BaseSelect.Portal.Props;
export type SelectPositionerProps = BaseSelect.Positioner.Props;
export type SelectPopupProps = BaseSelect.Popup.Props;
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
