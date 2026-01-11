import type { Select as BaseSelect } from "@base-ui/react/select";

import type { FieldProps } from "../field/field.types";
import type { InputVariants } from "../input/input.types";
import type { SelectItemProps } from "../select/select.types";

export type SelectMultipleRootProps = BaseSelect.Root.Props<string, true>;

export type SelectMultipleTriggerProps = BaseSelect.Trigger.Props &
  Pick<InputVariants, "ghost" | "fullwidth">;

export type SelectMultipleProps = React.PropsWithChildren<{
  placeholder?: string;
  items?: SelectItemProps[];
  RootProps?: SelectMultipleRootProps;
  TriggerProps?: SelectMultipleTriggerProps;
  PortalProps?: BaseSelect.Portal.Props;
  PositionerProps?: BaseSelect.Positioner.Props;
  PopupProps?: BaseSelect.Popup.Props;
  ListProps?: BaseSelect.List.Props;
  ValueProps?: BaseSelect.Value.Props & Pick<InputVariants, "size">;
  FieldProps?: FieldProps;
  IndicatorProps?: BaseSelect.Icon.Props;
}> &
  SelectMultipleRootProps &
  Pick<FieldProps, "label" | "description"> &
  InputVariants;
