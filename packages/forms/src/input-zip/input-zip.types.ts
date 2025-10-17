import type { InputProps } from "../input/input.types";

export type InputZipProps = Omit<InputProps, "pattern" | "inputMode">;
