import type { Radio } from "@base-ui-components/react/radio";

import type {
  FieldLabelProps,
  FieldDescriptionProps,
} from "../field/subcomponents";

import type { GroupProps } from "@uiid/layout";

export type RadioIndicatorProps = Radio.Indicator.Props;

export type RadioProps = Radio.Root.Props & {
  label?: string;
  description?: string;
  reversed?: boolean;
  bordered?: boolean;
  hideIndicator?: boolean;
  ContainerProps?: GroupProps;
  IndicatorProps?: RadioIndicatorProps;
  LabelProps?: FieldLabelProps;
  DescriptionProps?: FieldDescriptionProps;
};
