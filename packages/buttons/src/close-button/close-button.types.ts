import type { ButtonProps } from "../button/button.types";

export type CloseButtonProps = Omit<
  ButtonProps,
  "icon" | "size" | "shape" | "children"
>;
