import type { Checkbox } from "@base-ui-components/react/checkbox";

import type { GroupProps } from "@uiid/layout";

import type { FieldProps } from "../field/field.types";

export type CheckboxProps = Checkbox.Root.Props & {
  size?: "sm" | "md" | "lg";
  className?: string;
  reversed?: boolean;
  bordered?: boolean;
  ContainerProps?: GroupProps;
  IndicatorProps?: Checkbox.Indicator.Props;
} & Pick<FieldProps, "label" | "description" | "error">;
