import type { Radio as BaseRadio } from "@base-ui/react/radio";
import type { VariantProps } from "@uiid/utils";

import type { FieldRowProps } from "../field/field.types";
import type { radioVariants } from "./radio.variants";

export type RadioVariants = VariantProps<typeof radioVariants>;

export type RadioRootProps = BaseRadio.Root.Props &
  RadioVariants & {
    hideIndicator?: boolean;
  };
export type RadioIndicatorProps = BaseRadio.Indicator.Props;

export type RadioProps = RadioRootProps &
  Pick<FieldRowProps, "label" | "description"> & {
    FieldProps?: FieldRowProps;
    IndicatorProps?: RadioIndicatorProps;
  };
