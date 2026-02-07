"use client";

import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { AccordionPanelProps } from "../accordion.types";
import styles from "../accordion.module.css";

export const AccordionPanel = ({
  children,
  className,
  ...props
}: AccordionPanelProps) => {
  return (
    <BaseAccordion.Panel
      data-slot="accordion-panel"
      className={cx(styles["accordion-panel"], className)}
      {...props}
    >
      <Stack className={styles["accordion-panel-content"]}>{children}</Stack>
    </BaseAccordion.Panel>
  );
};
AccordionPanel.displayName = "AccordionPanel";
