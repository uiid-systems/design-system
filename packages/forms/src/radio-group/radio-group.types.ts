import type { RadioGroup } from "@base-ui/react/radio-group";
import type { StackProps } from "@uiid/layout";
import type { WithLayoutProps } from "@uiid/utils";

import type { FieldProps } from "../field/field.types";
import type { RadioProps } from "../radio/radio.types";
import type { FieldSlotProps } from "../shared/field-slot.types";
import type { FormItemProps } from "../types";

/**
 * The root lays its rows out from `orientation` and `w`, so it takes
 * no alignment axes of its own.
 */
type RadioGroupLayoutProps = Omit<StackProps, "ax" | "ay">;

export type RadioGroupRootProps = WithLayoutProps<
  RadioGroup.Props,
  RadioGroupLayoutProps
> & {
  orientation?: "horizontal" | "vertical";
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
  /**
   * Reaches every radio rendered from `items`. The keys RadioGroup sets on each
   * radio itself, from its own props and from each item, are left out.
   */
  RadioProps?: Partial<
    Omit<
      RadioProps,
      | "hideIndicator"
      | "size"
      | "bordered"
      | "reversed"
      | "color"
      | "IndicatorProps"
      | "value"
      | "label"
      | "disabled"
    >
  >;
  /** Reaches every radio's indicator, as the Radio slot of the same name. */
  IndicatorProps?: RadioProps["IndicatorProps"];
  /** Reaches the Field around the group. The keys RadioGroup hands to Field itself are left out. */
  FieldProps?: FieldSlotProps<"name" | "required" | "disabled" | "w" | "size">;
} & Pick<RadioProps, "size" | "bordered" | "reversed" | "color"> &
  Pick<FieldProps, "label" | "description" | "action">;
