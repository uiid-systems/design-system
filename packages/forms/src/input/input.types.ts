import type { Input } from "@base-ui-components/react/input";

export type InputProps = Omit<Input.Props, "size"> & {
  size?: "sm" | "md" | "lg";
};
