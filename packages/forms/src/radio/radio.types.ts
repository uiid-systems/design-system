import type { Radio } from "@base-ui-components/react/radio";

import type { GroupProps } from "@uiid/layout";

import type { LabelProps } from "../label/label.types";
import type { DescriptionProps } from "../description/description.types";

export type RadioIndicatorProps = Radio.Indicator.Props;

export type RadioProps = Radio.Root.Props & {
  label?: string;
  description?: string;
  reversed?: boolean;
  bordered?: boolean;
  hideIndicator?: boolean;
  ContainerProps?: GroupProps;
  IndicatorProps?: RadioIndicatorProps;
  LabelProps?: LabelProps;
  DescriptionProps?: DescriptionProps;
};
