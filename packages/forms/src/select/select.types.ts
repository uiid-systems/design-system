import type { Select as BaseSelect } from "@base-ui-components/react/select";

import type { Icon } from "@uiid/icons";

import type { FieldProps } from "../field/field.types";

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

export type SelectTriggerProps = Omit<BaseSelect.Trigger.Props, "children"> &
  Pick<SelectProps, "size">;

export type SelectPortalProps = BaseSelect.Portal.Props;
export type SelectPositionerProps = BaseSelect.Positioner.Props;

export type SelectListProps = BaseSelect.List.Props;

export type SelectProps<
  Value = string,
  Multiple extends SelectMultiple = false,
> = BaseSelect.Trigger.Props &
  React.PropsWithChildren<{
    placeholder?: string;
    size?: "sm" | "md" | "lg";
    items?: SelectItemProps[];
    RootProps?: BaseSelect.Root.Props<Value, Multiple>;
    TriggerProps?: BaseSelect.Trigger.Props;
    PortalProps?: BaseSelect.Portal.Props;
    PositionerProps?: BaseSelect.Positioner.Props;
    PopupProps?: BaseSelect.Popup.Props;
    ListProps?: BaseSelect.List.Props;
  }> &
  Pick<SelectRootProps<Value, Multiple>, "defaultValue" | "onValueChange"> &
  Pick<FieldProps, "label" | "description" | "error">;
