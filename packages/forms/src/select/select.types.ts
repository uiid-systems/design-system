import type { Select as BaseSelect } from "@base-ui/react/select";

import type { Icon } from "@uiid/icons";

import type { FieldProps } from "../field/field.types";
import type { InputVariants } from "../input/input.types";

import type { FormItemProps } from "../types";

/** Whether multi-select is enabled. `false` = single value, `true` = array of values. */
export type SelectMultiple = boolean | undefined;

export type SelectItemProps = FormItemProps & {
  description?: string;
  icon?: Icon;
};

export type SelectRootProps<
  Value,
  Multiple extends SelectMultiple = false,
> = BaseSelect.Root.Props<Value, Multiple>;
export type SelectTriggerProps = BaseSelect.Trigger.Props &
  Pick<InputVariants, "ghost" | "fullwidth">;
export type SelectPortalProps = BaseSelect.Portal.Props;
export type SelectPositionerProps = BaseSelect.Positioner.Props;
export type SelectPopupProps = BaseSelect.Popup.Props;
export type SelectListProps = BaseSelect.List.Props;
export type SelectValueProps = BaseSelect.Value.Props &
  Pick<InputVariants, "size">;
export type SelectIndicatorProps = BaseSelect.Icon.Props;

export type SelectProps<
  Value = string,
  Multiple extends SelectMultiple = false,
> = React.PropsWithChildren<{
  placeholder?: string;
  items?: SelectItemProps[];
  RootProps?: SelectRootProps<Value, Multiple>;
  TriggerProps?: SelectTriggerProps;
  PortalProps?: SelectPortalProps;
  PositionerProps?: SelectPositionerProps;
  PopupProps?: SelectPopupProps;
  ListProps?: SelectListProps;
  ValueProps?: SelectValueProps;
  FieldProps?: FieldProps;
  IndicatorProps?: SelectIndicatorProps;
}> &
  SelectRootProps<Value, Multiple> &
  Pick<FieldProps, "label" | "description"> &
  InputVariants;
