import type { Combobox as BaseCombobox } from "@base-ui-components/react/combobox";

import type { SelectMultiple, SelectItemProps } from "../select/select.types";
import type { FieldProps } from "../field/field.types";

export type ComboboxRootProps<
  Value,
  Multiple extends SelectMultiple = false,
> = BaseCombobox.Root.Props<Value, Multiple>;

export type ComboboxInputProps = BaseCombobox.Input.Props;

export type ComboboxProps<
  Value = string,
  Multiple extends SelectMultiple = false,
> = BaseCombobox.Trigger.Props &
  React.PropsWithChildren<{
    placeholder?: string;
    size?: "sm" | "md" | "lg";
    items?: SelectItemProps[];
    // RootProps?: BaseSelect.Root.Props<Value, Multiple>;
    // TriggerProps?: BaseSelect.Trigger.Props;
    // PortalProps?: BaseSelect.Portal.Props;
    // PositionerProps?: BaseSelect.Positioner.Props;
    // PopupProps?: BaseSelect.Popup.Props;
    // ListProps?: BaseSelect.List.Props;
  }> &
  Pick<ComboboxRootProps<Value, Multiple>, "defaultValue" | "onValueChange"> &
  Pick<FieldProps, "label" | "description" | "error">;
