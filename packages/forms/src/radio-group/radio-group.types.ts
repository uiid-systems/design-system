import type { RadioGroup } from "@base-ui/react/radio-group";
import type { StackProps } from "@uiid/layout";

import type { FieldProps } from "../field/field.types";
import type { RadioProps, RadioIndicatorProps } from "../radio/radio.types";
import type { FormItemProps } from "../types";

export type RadioGroupRootProps = RadioGroup.Props & {
  direction?: "horizontal" | "vertical";
};

export type RadioGroupProps = RadioGroup.Props &
  /* `color` is omitted alongside the layout axes because `StackProps` carries
     React's native `color` attribute, which would otherwise intersect with the
     palette hue picked up from `RadioProps`. */
  Omit<StackProps, "ax" | "ay" | "direction" | "color"> & {
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
  } & Pick<RadioProps, "bordered" | "reversed" | "color"> &
  Pick<FieldProps, "label" | "description">;
