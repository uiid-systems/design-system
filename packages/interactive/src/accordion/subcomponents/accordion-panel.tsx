"use client";

import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { cx } from "@uiid/utils";

import type { AccordionPanelProps } from "../accordion.types";
import { accordionPanelVariants } from "../accordion.variants";
import styles from "../accordion.module.css";

export const AccordionPanel = ({
  children,
  size,
  className,
  ...props
}: AccordionPanelProps) => {
  return (
    <BaseAccordion.Panel
      data-slot="accordion-panel"
      className={cx(
        styles["accordion-panel"],
        accordionPanelVariants({ size }),
        className,
      )}
      {...props}
    >
      {children}
    </BaseAccordion.Panel>
  );
};
AccordionPanel.displayName = "AccordionPanel";
