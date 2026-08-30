import type { Select as BaseSelect } from "@base-ui/react/select";

import type { FieldProps } from "../field/field.types";
import type { InputVariants } from "../input/input.types";
import type {
  SelectItemProps,
  SelectTriggerProps,
} from "../select/select.types";

export type SelectMultipleRootProps = BaseSelect.Root.Props<string, true>;

export type SelectMultipleTriggerProps = SelectTriggerProps;

export type SelectMultipleProps = React.PropsWithChildren<{
  placeholder?: string;
  before?: React.ReactNode;
  after?: React.ReactNode;
  items?: SelectItemProps[];
  RootProps?: SelectMultipleRootProps;
  TriggerProps?: SelectMultipleTriggerProps;
  PortalProps?: BaseSelect.Portal.Props;
  PositionerProps?: BaseSelect.Positioner.Props;
  PopupProps?: BaseSelect.Popup.Props;
  ListProps?: BaseSelect.List.Props;
  ValueProps?: BaseSelect.Value.Props & Pick<InputVariants, "size">;
  FieldProps?: FieldProps;
  IconProps?: BaseSelect.Icon.Props;
}> &
  SelectMultipleRootProps &
  Pick<FieldProps, "label" | "description"> &
  InputVariants;
