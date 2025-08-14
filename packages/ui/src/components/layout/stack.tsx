import { Box, type BoxProps } from "./box";

import "./stack.styles.css";

export type StackProps = {
  ax?: BoxProps["ay"];
  ay?: BoxProps["ax"];
} & Omit<BoxProps, "ax" | "ay">;

export const Stack = ({ ax, ay, className, ...props }: StackProps) => (
  <Box uiid="stack" ax={ay} ay={ax} className={className} {...props} />
);
Stack.displayName = "Stack";
