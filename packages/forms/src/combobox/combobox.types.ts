import type { Combobox as BaseCombobox } from "@base-ui/react/combobox";

import type { FieldProps } from "../field/field.types";
import type { InputProps } from "../input/input.types";
import type { SelectMultipleMode } from "../select/select.types";

export type ComboboxRootProps<
  Value,
  Multiple extends SelectMultipleMode = false,
> = BaseCombobox.Root.Props<Value, Multiple>;

export type ComboboxInputProps = BaseCombobox.Input.Props &
  Pick<InputProps, "FieldProps" | "before" | "after"> &
  Pick<FieldProps, "label" | "description">;
export type ComboboxPortalProps = BaseCombobox.Portal.Props;
export type ComboboxPositionerProps = BaseCombobox.Positioner.Props;
export type ComboboxPopupProps = BaseCombobox.Popup.Props;
export type ComboboxListProps = BaseCombobox.List.Props;
export type ComboboxItemProps = BaseCombobox.Item.Props;
export type ComboboxEmptyProps = BaseCombobox.Empty.Props;
export type ComboboxInputGroupProps = BaseCombobox.InputGroup.Props;
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
    "placeholder" | "onFocus" | "onBlur" | "before" | "after"
  > &
  Pick<FieldProps, "label" | "description">;
