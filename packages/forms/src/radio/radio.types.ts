import type { Radio as BaseRadio } from "@base-ui/react/radio";
import type { GroupProps } from "@uiid/layout";
import type { CheckboxFieldProps } from "../checkbox/checkbox.types";

export type RadioRootProps = BaseRadio.Root.Props & {
  hideIndicator?: boolean;
};
export type RadioIndicatorProps = BaseRadio.Indicator.Props;

export type RadioProps = RadioRootProps &
  Pick<
    CheckboxFieldProps,
    "label" | "description" | "reversed" | "bordered"
  > & {
    ContainerProps?: GroupProps;
    IndicatorProps?: RadioIndicatorProps;
  };
