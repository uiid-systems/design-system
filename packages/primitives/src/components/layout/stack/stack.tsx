import { cx } from "../../../utils";
import { Box } from "../box/box";

import type { StackProps } from "./stack.types";
import styles from "./stack.module.css";

export const Stack = ({ ax, ay, className, ...props }: StackProps) => (
  <Box
    uiid="stack"
    ax={ay}
    ay={ax}
    className={cx(styles.stack, className)}
    {...props}
  />
);
Stack.displayName = "Stack";
