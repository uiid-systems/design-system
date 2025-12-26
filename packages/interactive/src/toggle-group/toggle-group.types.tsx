import type { ToggleGroup } from "@base-ui/react/toggle-group";

export type ToggleGroupProps = Omit<ToggleGroup.Props, "onValueChange"> & {
  size?: "sm" | "md" | "lg";
  /** Callback when the selected values change. */
  onValueChange?: (value: string[]) => void;
};
