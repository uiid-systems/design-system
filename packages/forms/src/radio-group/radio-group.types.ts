import type { RadioGroup } from "@base-ui/react/radio-group";
import type { StackProps } from "@uiid/layout";
import type { WithLayoutProps } from "@uiid/utils";

import type { FieldProps } from "../field/field.types";
import type { RadioProps, RadioIndicatorProps } from "../radio/radio.types";
import type { FormItemProps } from "../types";

/**
 * The root lays its rows out from `orientation` and `fullwidth`, so it takes
 * no alignment axes of its own.
 */
type RadioGroupLayoutProps = Omit<StackProps, "ax" | "ay" | "direction">;

export type RadioGroupRootProps = WithLayoutProps<
  RadioGroup.Props,
  RadioGroupLayoutProps
> & {
  orientation?: "horizontal" | "vertical";
  /** Stretch to fill the container width, sharing it evenly between the rows */
  fullwidth?: boolean;
};

export type RadioGroupProps = WithLayoutProps<
  RadioGroup.Props,
  RadioGroupLayoutProps
> & {
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
  Pick<FieldProps, "label" | "description" | "action">;
