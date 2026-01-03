import type { RadioGroup } from "@base-ui/react/radio-group";

import type { StackProps } from "@uiid/layout";

import type { FieldProps } from "../field/field.types";
import type { RadioProps, RadioIndicatorProps } from "../radio/radio.types";
import type { FormItemProps } from "../types";

export type RadioGroupProps = RadioGroup.Props &
  Omit<StackProps, "ax" | "ay" | "direction"> & {
    items: FormItemProps[];
    direction?: "horizontal" | "vertical";
    hideIndicators?: RadioProps["hideIndicator"];
    RadioProps?: Partial<RadioProps>;
    IndicatorProps?: RadioIndicatorProps;
  } & Pick<RadioProps, "bordered" | "reversed"> &
  Pick<FieldProps, "label" | "description">;
