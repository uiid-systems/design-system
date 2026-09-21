"use client";

import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { Card } from "@uiid/cards";
import { cx } from "@uiid/utils";

import type { AccordionRootProps } from "../accordion.types";
import { accordionRootVariants } from "../accordion.variants";

import styles from "../accordion.module.css";

export const AccordionRoot = ({
  children,
  className,
  variant,
  gap = 0,
  p = 0,
  fullwidth = true,
  ...props
}: AccordionRootProps) => {
  return (
    <BaseAccordion.Root
      data-slot="accordion-root"
      data-variant={variant}
      render={<Card gap={gap} p={p} fullwidth={fullwidth} />}
      className={cx(
        styles["accordion-root"],
        accordionRootVariants({ variant }),
        className,
      )}
      {...props}
    >
      {children}
    </BaseAccordion.Root>
  );
};
AccordionRoot.displayName = "AccordionRoot";
