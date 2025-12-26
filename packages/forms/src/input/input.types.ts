import type { Input } from "@base-ui/react/input";
import type { FieldProps } from "../field/field.types";

export type InputProps = Omit<Input.Props, "size"> & {
  size?: "sm" | "md" | "lg";
} & Pick<FieldProps, "label" | "description" | "error">;
