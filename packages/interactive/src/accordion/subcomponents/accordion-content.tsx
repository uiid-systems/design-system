import { Stack } from "@uiid/layout";

import type { AccordionContentProps } from "../accordion.types";
import styles from "../accordion.module.css";

export const AccordionContent = ({
  children,
  ...props
}: AccordionContentProps) => {
  return (
    <Stack
      data-slot="accordion-content"
      className={styles["accordion-content"]}
      {...props}
    >
      {children}
    </Stack>
  );
};
AccordionContent.displayName = "AccordionContent";
