import { Box } from "../box/box";

import type { StackProps } from "./stack.types";
import "./stack.styles.css";

export const Stack = ({ ax, ay, className, ...props }: StackProps) => (
  <Box uiid="stack" ax={ay} ay={ax} className={className} {...props} />
);
Stack.displayName = "Stack";
