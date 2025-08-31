import { Input } from "../input/input";
import type { InputProps } from "../input/input.types";

export const InputCurrency = ({ ...props }: InputProps) => {
  return <Input {...props} />;
};
InputCurrency.displayName = "InputCurrency";
