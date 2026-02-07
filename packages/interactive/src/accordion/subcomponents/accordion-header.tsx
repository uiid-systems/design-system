"use client";

import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { cx } from "@uiid/utils";

import type { AccordionHeaderProps } from "../accordion.types";

export const AccordionHeader = ({
  children,
  className,
  ...props
}: AccordionHeaderProps) => {
  return (
    <BaseAccordion.Header
      data-slot="accordion-header"
      className={cx(className)}
      {...props}
    >
      {children}
    </BaseAccordion.Header>
  );
};
AccordionHeader.displayName = "AccordionHeader";
