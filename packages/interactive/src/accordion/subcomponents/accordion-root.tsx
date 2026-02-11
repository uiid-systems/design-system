"use client";

import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import type { AccordionRootProps } from "../accordion.types";
import styles from "../accordion.module.css";

export const AccordionRoot = ({
  children,
  className,
  ...props
}: AccordionRootProps) => {
  return (
    <BaseAccordion.Root
      data-slot="accordion-root"
      render={<Card gap={0} trimmed fullwidth />}
      className={cx(styles["accordion-root"], className)}
      {...props}
    >
      {children}
    </BaseAccordion.Root>
  );
};
AccordionRoot.displayName = "AccordionRoot";
