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
  ghost,
  ...props
}: AccordionRootProps) => {
  return (
    <BaseAccordion.Root
      data-slot="accordion-root"
      render={<Card gap={0} trimmed fullwidth ghost={ghost} />}
      className={cx(
        styles["accordion-root"],
        accordionRootVariants({ ghost }),
        className,
      )}
      {...props}
    >
      {children}
    </BaseAccordion.Root>
  );
};
AccordionRoot.displayName = "AccordionRoot";
