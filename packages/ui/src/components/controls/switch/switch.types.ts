import type { Switch } from "@base-ui-components/react/switch";
import type { FormProps } from "../../forms/types";

export type SwitchProps = {
  RootProps?: Switch.Root.Props;
  ThumbProps?: Switch.Thumb.Props;
  labelPosition?: "before" | "after";
} & Pick<FormProps, "label" | "name" | "disabled">;
