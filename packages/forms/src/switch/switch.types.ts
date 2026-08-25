import type { Switch } from "@base-ui/react/switch";
import type { GroupProps } from "@uiid/layout";

import type { CheckboxVariants } from "../checkbox/checkbox.types";
import type {
  FieldDescriptionProps,
  FieldLabelProps,
  FieldProps,
} from "../field/field.types";

export type SwitchVariants = Pick<CheckboxVariants, "reversed" | "bordered">;
export type SwitchRootProps = Switch.Root.Props;
export type SwitchThumbProps = Switch.Thumb.Props;

export type SwitchFieldProps = GroupProps &
  Pick<SwitchVariants, "reversed" | "bordered"> &
  Pick<FieldProps, "label" | "description"> & {
    LabelProps?: FieldLabelProps;
    DescriptionProps?: FieldDescriptionProps;
  };

export type SwitchProps = SwitchRootProps & {
  RootProps?: SwitchRootProps;
  ThumbProps?: Switch.Thumb.Props;
  FieldProps?: SwitchFieldProps;
} & Pick<FieldProps, "label" | "description" | "disabled"> &
  Pick<SwitchFieldProps, "reversed" | "bordered">;
