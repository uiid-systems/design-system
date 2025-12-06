import type { Checkbox } from "@base-ui-components/react/checkbox";

export type CheckboxProps = Checkbox.Root.Props & {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  IndicatorProps?: Checkbox.Indicator.Props;
};
