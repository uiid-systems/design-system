import type { Combobox as BaseCombobox } from "@base-ui/react/combobox";

import type { FieldProps } from "../field/field.types";
import type { InputProps } from "../input/input.types";
import type { SelectMultiple } from "../select/select.types";

export type ComboboxRootProps<
  Value,
  Multiple extends SelectMultiple = false,
> = BaseCombobox.Root.Props<Value, Multiple>;

export type ComboboxInputProps = BaseCombobox.Input.Props &
  Pick<InputProps, "FieldProps"> &
  Pick<FieldProps, "label" | "description">;
export type ComboboxPortalProps = BaseCombobox.Portal.Props;
export type ComboboxPositionerProps = BaseCombobox.Positioner.Props;
export type ComboboxPopupProps = BaseCombobox.Popup.Props;
export type ComboboxListProps = BaseCombobox.List.Props;
export type ComboboxItemProps = BaseCombobox.Item.Props;
export type ComboboxEmptyProps = BaseCombobox.Empty.Props;

export type ComboboxProps<
  Value = string,
  Multiple extends SelectMultiple = false,
> = BaseCombobox.Trigger.Props &
  React.PropsWithChildren<{
    placeholder?: string;
    RootProps?: ComboboxRootProps<Value, Multiple>;
    InputProps?: ComboboxInputProps;
    PortalProps?: ComboboxPortalProps;
    PositionerProps?: ComboboxPositionerProps;
    PopupProps?: ComboboxPopupProps;
    ListProps?: ComboboxListProps;
  }> &
  Pick<
    ComboboxRootProps<Value, Multiple>,
    "items" | "defaultValue" | "onValueChange" | "required"
  > &
  Pick<FieldProps, "label" | "description">;
