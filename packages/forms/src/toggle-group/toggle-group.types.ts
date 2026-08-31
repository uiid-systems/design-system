import type { ToggleGroup } from "@base-ui/react/toggle-group";

export type ToggleGroupProps = Omit<ToggleGroup.Props, "onValueChange"> & {
  size?: "sm" | "md" | "lg";
  /** Surface treatment — filled by default, `ghost` drops the container background and border. */
  variant?: "ghost";
  /** Callback when the selected values change. */
  onValueChange?: (value: string[]) => void;
};
