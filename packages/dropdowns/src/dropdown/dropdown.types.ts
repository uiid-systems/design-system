import type { ButtonProps } from "@uiid/buttons";
import type { PopoverProps } from "@uiid/overlays";

export type DropdownProps = Omit<PopoverProps, "trigger" | "TriggerProps"> & {
  size?: ButtonProps["size"];
  TriggerProps?: ButtonProps;
  className?: string;
  placeholder?: string;
};
