import type { Radio as BaseRadio } from "@base-ui/react/radio";

import type {
  CheckboxFieldProps,
  CheckboxVariants,
} from "../checkbox/checkbox.types";
import type { FieldRowProps } from "../field/field.types";

export type RadioVariants = CheckboxVariants;

export type RadioRootProps = BaseRadio.Root.Props &
  RadioVariants & {
    hideIndicator?: boolean;
  };
export type RadioIndicatorProps = BaseRadio.Indicator.Props;

export type RadioProps = RadioRootProps &
  Pick<
    CheckboxFieldProps,
    "label" | "description" | "reversed" | "bordered"
  > & {
    FieldProps?: FieldRowProps;
    IndicatorProps?: RadioIndicatorProps;
  };
