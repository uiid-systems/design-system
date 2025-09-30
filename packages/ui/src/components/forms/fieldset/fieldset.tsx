import { Box } from "@uiid/primitives";

import type { FieldsetProps } from "./fieldset.types";
import styles from "./fieldset.module.css";

export const Fieldset = ({ children, ...props }: FieldsetProps) => {
  return (
    <Box
      uiid="fieldset"
      render={<fieldset />}
      className={styles.fieldset}
      {...props}
    >
      {children}
    </Box>
  );
};

Fieldset.displayName = "Fieldset";
