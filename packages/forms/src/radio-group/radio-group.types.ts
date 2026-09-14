import type { RadioGroup } from "@base-ui/react/radio-group";
import type { StackProps } from "@uiid/layout";

import type { FieldProps } from "../field/field.types";
import type { RadioProps, RadioIndicatorProps } from "../radio/radio.types";
import type { FormItemProps } from "../types";

export type RadioGroupRootProps = RadioGroup.Props & {
  orientation?: "horizontal" | "vertical";
  /** Stretch to fill the container width, sharing it evenly between the rows */
  fullwidth?: boolean;
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
    orientation?: "horizontal" | "vertical";
    hideIndicators?: RadioProps["hideIndicator"];
    required?: boolean;
    RadioProps?: Partial<RadioProps>;
    IndicatorProps?: RadioIndicatorProps;
    FieldProps?: Partial<FieldProps>;
  } & Pick<RadioProps, "size" | "bordered" | "reversed" | "color"> &
  Pick<FieldProps, "label" | "description">;
