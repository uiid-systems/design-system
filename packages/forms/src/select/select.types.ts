import type { Select } from "@base-ui-components/react/select";
import type { Icon } from "@uiid/icons";

import type { FieldProps } from "../field/field.types";

import type { FormItemProps } from "../types";

export type SelectItemProps = FormItemProps & {
  description?: string;
  icon?: Icon;
};

export type SelectProps = Omit<Select.Root.Props<string>, "size"> &
  React.PropsWithChildren<{
    placeholder?: string;
    size?: "sm" | "md" | "lg";
    items?: SelectItemProps[];
    TriggerProps?: Select.Trigger.Props;
    PopupProps?: Select.Popup.Props;
  }> &
  Pick<FieldProps, "label" | "description" | "error">;
