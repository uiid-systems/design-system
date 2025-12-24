import type { Switch } from "@base-ui-components/react/switch";

import type { FieldProps } from "@uiid/forms";

export type SwitchRootProps = Switch.Root.Props;
export type SwitchThumbProps = Switch.Thumb.Props;

export type SwitchLabelProps = {
  disabled?: boolean;
  name?: string;
  label?: string;
};

export type SwitchProps = {
  RootProps?: SwitchRootProps;
  ThumbProps?: Switch.Thumb.Props;
  labelPosition?: "before" | "after";
} & Pick<FieldProps, "label" | "name" | "disabled">;
