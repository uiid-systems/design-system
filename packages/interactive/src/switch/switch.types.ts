import type { Switch } from "@base-ui-components/react/switch";

import type { FieldProps } from "@uiid/forms";

export type SwitchProps = {
  RootProps?: Switch.Root.Props;
  ThumbProps?: Switch.Thumb.Props;
  labelPosition?: "before" | "after";
} & Pick<FieldProps, "label" | "name" | "disabled">;
