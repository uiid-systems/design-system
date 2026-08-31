import type { RadioGroup } from "@base-ui/react/radio-group";
import type { StackProps } from "@uiid/layout";

import type { FieldProps } from "../field/field.types";
import type { RadioProps, RadioIndicatorProps } from "../radio/radio.types";
import type { FormItemProps } from "../types";

export type RadioGroupRootProps = RadioGroup.Props & {
  direction?: "horizontal" | "vertical";
};

export type RadioGroupProps = RadioGroup.Props &
  Omit<StackProps, "ax" | "ay" | "direction"> & {
    /**
     * Convenience list for the common case. Omit it and pass `children` to
     * compose `Radio` (or `RadioGroupRoot`) directly instead.
     */
    items?: FormItemProps[];
    direction?: "horizontal" | "vertical";
    hideIndicators?: RadioProps["hideIndicator"];
    required?: boolean;
    RadioProps?: Partial<RadioProps>;
    IndicatorProps?: RadioIndicatorProps;
    FieldProps?: Partial<FieldProps>;
  } & Pick<RadioProps, "bordered" | "reversed"> &
  Pick<FieldProps, "label" | "description">;
