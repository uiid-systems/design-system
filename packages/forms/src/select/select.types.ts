import type { Select } from "@base-ui-components/react/select";
import type { Icon } from "@uiid/icons";

import type { FieldProps } from "../field/field.types";

import type { FormOptionProps } from "../types";

export type SelectItemProps = FormOptionProps & {
  description?: string;
  icon?: Icon;
};

export type SelectProps = Omit<Select.Root.Props<string>, "size"> &
  React.PropsWithChildren<{
    size?: "sm" | "md" | "lg";
    items?: SelectItemProps[];
    TriggerProps?: Select.Trigger.Props;
    PopupProps?: Select.Popup.Props;
  }> &
  Pick<FieldProps, "label" | "description" | "error">;
