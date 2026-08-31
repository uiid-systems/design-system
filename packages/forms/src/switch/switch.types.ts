import type { Switch } from "@base-ui/react/switch";
import type { GroupProps } from "@uiid/layout";
import type { VariantProps } from "@uiid/utils";

import type { CheckboxVariants } from "../checkbox/checkbox.types";
import type {
  FieldDescriptionProps,
  FieldLabelProps,
  FieldProps,
} from "../field/field.types";
import type { switchVariants } from "./switch.variants";

/**
 * `reversed` and `bordered` are the shared field-row treatments, so they come
 * from Checkbox — the component that owns those styles. `size` is Switch's own
 * axis: a track scales differently from a box.
 */
export type SwitchVariants = Pick<CheckboxVariants, "reversed" | "bordered"> &
  VariantProps<typeof switchVariants>;

export type SwitchRootProps = Switch.Root.Props & Pick<SwitchVariants, "size">;
export type SwitchThumbProps = Switch.Thumb.Props;

export type SwitchFieldProps = GroupProps &
  Pick<SwitchVariants, "reversed" | "bordered" | "size"> &
  Pick<FieldProps, "label" | "description"> & {
    LabelProps?: FieldLabelProps;
    DescriptionProps?: FieldDescriptionProps;
  };

export type SwitchProps = SwitchRootProps & {
  RootProps?: SwitchRootProps;
  ThumbProps?: Switch.Thumb.Props;
  FieldProps?: SwitchFieldProps;
} & Pick<FieldProps, "label" | "description" | "disabled"> &
  Pick<SwitchFieldProps, "reversed" | "bordered" | "size">;
