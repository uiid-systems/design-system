import { Input } from "../input/input";
import type { InputDatetimeProps } from "./input-datetime.types";

export const InputDatetime = ({ type, ...props }: InputDatetimeProps) => {
  if (!type) {
    throw new Error("InputDatetime requires a type prop");
  }

  return <Input {...props} type={type} />;
};
InputDatetime.displayName = "InputDatetime";
