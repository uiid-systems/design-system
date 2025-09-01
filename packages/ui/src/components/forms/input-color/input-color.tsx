import { Input } from "../input/input";
import type { InputColorProps } from "./input-color.types";
import "./input-color.styles.css";

export const InputColor = ({ ...props }: InputColorProps) => {
  return <Input {...props} type="color" />;
};
InputColor.displayName = "InputColor";
