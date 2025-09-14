import type { InputProps } from "../input/input.types";
import type { FileIconProps } from "./subcomponents/file-icon";

export type InputFileProps = Omit<InputProps, "type" | "before"> &
  FileIconProps;
