import type { ToggleGroup } from "@base-ui/react/toggle-group";

export type ToggleGroupProps = Omit<ToggleGroup.Props, "onValueChange"> & {
  size?: "sm" | "md" | "lg";
  /** Removes the container background and border. */
  ghost?: boolean;
  /** Callback when the selected values change. */
  onValueChange?: (value: string[]) => void;
};
