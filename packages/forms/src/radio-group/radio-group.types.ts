import type { RadioGroup } from "@base-ui-components/react/radio-group";
import type { Radio } from "@base-ui-components/react/radio";

import type { StackProps } from "@uiid/layout";

import type { FormOptionProps } from "../types";
import type { RadioProps } from "../radio/radio.types";

export type RadioGroupProps = RadioGroup.Props &
  StackProps & {
    options: FormOptionProps[];
    axis?: "x" | "y";
    RadioProps?: Partial<RadioProps>;
    IndicatorProps?: Radio.Indicator.Props;
  } & Pick<RadioProps, "bordered" | "reversed" | "hideIndicator">;
