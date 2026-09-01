import type { Radio as BaseRadio } from "@base-ui/react/radio";
import type { PaletteColor } from "@uiid/tokens";
import type { VariantProps } from "@uiid/utils";

import type { FieldRowProps } from "../field/field.types";
import type { radioVariants } from "./radio.variants";

export type RadioVariants = VariantProps<typeof radioVariants>;

/**
 * Palette hue for the checked ring. One hue resolves the fill and the dot that
 * reads against it.
 */
export type RadioColor = PaletteColor;

export type RadioRootProps = BaseRadio.Root.Props &
  RadioVariants & {
    hideIndicator?: boolean;
    /**
     * Palette hue applied to the checked ring only. Unchecked and resting
     * surfaces stay on shade tokens, so the hue marks the choice rather than
     * the widget.
     */
    color?: RadioColor;
  };
export type RadioIndicatorProps = BaseRadio.Indicator.Props;

export type RadioProps = RadioRootProps &
  Pick<FieldRowProps, "label" | "description"> & {
    FieldProps?: FieldRowProps;
    IndicatorProps?: RadioIndicatorProps;
  };
